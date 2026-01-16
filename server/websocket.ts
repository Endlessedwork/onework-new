import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

// ============================================================
// WebSocket Events
// ============================================================
export type ChatEventType =
  | "new:conversation"
  | "new:message"
  | "conversation:updated"
  | "typing:start"
  | "typing:stop"
  | "admin:joined"
  | "admin:left";

export interface ChatEvent {
  type: ChatEventType;
  payload: any;
  conversationId?: number;
  timestamp: Date;
}

// ============================================================
// WebSocket Server
// ============================================================
let io: Server | null = null;

export function setupWebSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    },
    path: "/socket.io",
  });

  // Admin namespace for admin dashboard
  const adminNamespace = io.of("/admin");

  adminNamespace.on("connection", (socket: Socket) => {
    console.log(`Admin connected: ${socket.id}`);

    // Join conversation room
    socket.on("join:conversation", (conversationId: number) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Admin ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on("leave:conversation", (conversationId: number) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Admin ${socket.id} left conversation ${conversationId}`);
    });

    // Admin starts typing
    socket.on("typing:start", (conversationId: number) => {
      io?.emit(`conversation:${conversationId}:typing`, { isTyping: true });
    });

    // Admin stops typing
    socket.on("typing:stop", (conversationId: number) => {
      io?.emit(`conversation:${conversationId}:typing`, { isTyping: false });
    });

    socket.on("disconnect", () => {
      console.log(`Admin disconnected: ${socket.id}`);
    });
  });

  // Public namespace for customers
  io.on("connection", (socket: Socket) => {
    console.log(`Customer connected: ${socket.id}`);

    // Join session room
    socket.on("join:session", (sessionId: string) => {
      socket.join(`session:${sessionId}`);
      console.log(`Customer ${socket.id} joined session ${sessionId}`);
    });

    // Customer typing indicator
    socket.on("typing:start", (sessionId: string) => {
      broadcastToAdmins("typing:start", { sessionId });
    });

    socket.on("typing:stop", (sessionId: string) => {
      broadcastToAdmins("typing:stop", { sessionId });
    });

    socket.on("disconnect", () => {
      console.log(`Customer disconnected: ${socket.id}`);
    });
  });

  console.log("WebSocket server initialized");
  return io;
}

// ============================================================
// Broadcast Functions
// ============================================================

/**
 * Broadcast event to all admin clients
 */
export function broadcastToAdmins(event: string, data: any): void {
  if (!io) return;
  io.of("/admin").emit(event, data);
}

/**
 * Broadcast event to specific conversation room
 */
export function broadcastToConversation(conversationId: number, event: string, data: any): void {
  if (!io) return;
  io.of("/admin").to(`conversation:${conversationId}`).emit(event, data);
}

/**
 * Broadcast event to customer session
 */
export function broadcastToSession(sessionId: string, event: string, data: any): void {
  if (!io) return;
  io.to(`session:${sessionId}`).emit(event, data);
}

/**
 * Notify admins of new conversation
 */
export function notifyNewConversation(conversation: any): void {
  broadcastToAdmins("new:conversation", conversation);
}

/**
 * Notify about new message - both to admins and customer
 */
export function notifyNewMessage(conversationId: number, sessionId: string, message: any): void {
  // To admins watching this conversation
  broadcastToConversation(conversationId, "new:message", message);

  // Also broadcast to admin list to update unread count
  broadcastToAdmins("conversation:message", {
    conversationId,
    message,
  });

  // To customer in this session
  broadcastToSession(sessionId, "new:message", message);
}

/**
 * Notify conversation status/mode changed
 */
export function notifyConversationUpdated(conversationId: number, sessionId: string, updates: any): void {
  broadcastToConversation(conversationId, "conversation:updated", updates);
  broadcastToAdmins("conversation:updated", { conversationId, ...updates });
  broadcastToSession(sessionId, "conversation:updated", updates);
}

export function getIO(): Server | null {
  return io;
}
