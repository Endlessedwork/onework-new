import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Message, Conversation } from "@shared/schema";

// ============================================================
// Types
// ============================================================
interface UseChatSocketOptions {
  namespace?: string; // "/admin" for admin dashboard, undefined for customers
  onNewConversation?: (conversation: Conversation) => void;
  onNewMessage?: (message: Message) => void;
  onConversationUpdated?: (data: { conversationId: number } & Partial<Conversation>) => void;
  onTyping?: (data: { isTyping: boolean; sessionId?: string }) => void;
}

interface UseChatSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: number) => void;
  leaveConversation: (conversationId: number) => void;
  joinSession: (sessionId: string) => void;
  emitTypingStart: (id: number | string) => void;
  emitTypingStop: (id: number | string) => void;
}

// ============================================================
// Admin Socket Hook
// ============================================================
export function useAdminChatSocket(options: Omit<UseChatSocketOptions, "namespace"> = {}): UseChatSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { onNewConversation, onNewMessage, onConversationUpdated, onTyping } = options;

  useEffect(() => {
    // Connect to admin namespace
    const socket = io("/admin", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Admin socket connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Admin socket disconnected");
      setIsConnected(false);
    });

    // Event listeners
    if (onNewConversation) {
      socket.on("new:conversation", onNewConversation);
    }

    if (onNewMessage) {
      socket.on("new:message", onNewMessage);
    }

    if (onConversationUpdated) {
      socket.on("conversation:updated", onConversationUpdated);
    }

    // Listen for conversation messages (for list updates)
    socket.on("conversation:message", (data: { conversationId: number; message: Message }) => {
      onNewMessage?.(data.message);
    });

    if (onTyping) {
      socket.on("typing:start", (data) => onTyping({ ...data, isTyping: true }));
      socket.on("typing:stop", (data) => onTyping({ ...data, isTyping: false }));
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [onNewConversation, onNewMessage, onConversationUpdated, onTyping]);

  const joinConversation = useCallback((conversationId: number) => {
    socketRef.current?.emit("join:conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: number) => {
    socketRef.current?.emit("leave:conversation", conversationId);
  }, []);

  const emitTypingStart = useCallback((conversationId: number | string) => {
    socketRef.current?.emit("typing:start", conversationId);
  }, []);

  const emitTypingStop = useCallback((conversationId: number | string) => {
    socketRef.current?.emit("typing:stop", conversationId);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinConversation,
    leaveConversation,
    joinSession: () => {}, // Not used by admin
    emitTypingStart,
    emitTypingStop,
  };
}

// ============================================================
// Customer Socket Hook
// ============================================================
export function useCustomerChatSocket(
  sessionId: string | null,
  options: Omit<UseChatSocketOptions, "namespace"> = {}
): UseChatSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { onNewMessage, onConversationUpdated } = options;

  useEffect(() => {
    if (!sessionId) return;

    // Connect to default namespace
    const socket = io({
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Customer socket connected");
      setIsConnected(true);
      // Join session room
      socket.emit("join:session", sessionId);
    });

    socket.on("disconnect", () => {
      console.log("Customer socket disconnected");
      setIsConnected(false);
    });

    // Event listeners
    if (onNewMessage) {
      socket.on("new:message", onNewMessage);
    }

    if (onConversationUpdated) {
      socket.on("conversation:updated", onConversationUpdated);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, onNewMessage, onConversationUpdated]);

  const joinSession = useCallback((sid: string) => {
    socketRef.current?.emit("join:session", sid);
  }, []);

  const emitTypingStart = useCallback((sid: number | string) => {
    socketRef.current?.emit("typing:start", sid);
  }, []);

  const emitTypingStop = useCallback((sid: number | string) => {
    socketRef.current?.emit("typing:stop", sid);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinConversation: () => {}, // Not used by customer
    leaveConversation: () => {},
    joinSession,
    emitTypingStart,
    emitTypingStop,
  };
}
