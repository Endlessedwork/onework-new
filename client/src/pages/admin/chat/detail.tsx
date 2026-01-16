import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  UserCheck,
  Clock,
  Phone,
  Mail,
  Zap,
  MoreVertical,
  Trash2,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Conversation, Message, QuickResponse } from "@shared/schema";
import { useAdminChatSocket } from "@/hooks/useChatSocket";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function AdminChatDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [showQuickResponses, setShowQuickResponses] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) setLocation("/admin/login");
    } catch (error) {
      setLocation("/admin/login");
    }
  };

  // Fetch conversation with messages
  const { data, isLoading, refetch } = useQuery<{
    conversation: Conversation;
    messages: Message[];
  }>({
    queryKey: [`/api/admin/chat/conversations/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/chat/conversations/${id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch conversation");
      return response.json();
    },
    enabled: !!id,
    refetchInterval: 5000,
  });

  // Fetch quick responses
  const { data: quickResponses = [] } = useQuery<QuickResponse[]>({
    queryKey: ["/api/admin/chat/quick-responses"],
    queryFn: async () => {
      const response = await fetch("/api/admin/chat/quick-responses", {
        credentials: "include",
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  // WebSocket for real-time updates
  const handleNewMessage = useCallback(() => {
    refetch();
  }, [refetch]);

  const { joinConversation, leaveConversation, emitTypingStart, emitTypingStop } =
    useAdminChatSocket({
      onNewMessage: handleNewMessage,
    });

  // Join conversation room
  useEffect(() => {
    if (id) {
      joinConversation(parseInt(id));
      return () => leaveConversation(parseInt(id));
    }
  }, [id, joinConversation, leaveConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/admin/chat/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      refetch();
      emitTypingStop(parseInt(id!));
    },
    onError: () => toast.error("Failed to send message"),
  });

  // Update conversation mutation
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Conversation>) => {
      const response = await fetch(`/api/admin/chat/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update conversation");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/conversations"] });
      toast.success("Conversation updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  // Delete conversation mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/chat/conversations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Conversation deleted");
      setLocation("/admin/chat");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickResponse = (content: string) => {
    setMessage(content);
    setShowQuickResponses(false);
  };

  const conversation = data?.conversation;
  const messages = data?.messages || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/chat">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {conversation.customerName || "Anonymous"}
                </h1>
                <Badge
                  variant={conversation.status === "active" ? "default" : "secondary"}
                >
                  {conversation.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {conversation.customerEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {conversation.customerEmail}
                  </span>
                )}
                {conversation.customerPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {conversation.customerPhone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Selector */}
            <Select
              value={conversation.mode}
              onValueChange={(value) => updateMutation.mutate({ mode: value as any })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AI Mode
                  </span>
                </SelectItem>
                <SelectItem value="human">
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Human
                  </span>
                </SelectItem>
                <SelectItem value="hybrid">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Hybrid
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    updateMutation.mutate({
                      status: conversation.status === "active" ? "closed" : "active",
                    })
                  }
                >
                  {conversation.status === "active" ? "Close" : "Reopen"} Conversation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateMutation.mutate({ status: "archived" })}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this conversation?")) {
                      deleteMutation.mutate();
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No messages yet
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderType === "customer" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.senderType === "customer"
                      ? "bg-white border shadow-sm"
                      : msg.senderType === "ai"
                      ? "bg-blue-50 border border-blue-100"
                      : "bg-primary text-white"
                  }`}
                >
                  {/* Sender indicator */}
                  <div
                    className={`flex items-center gap-2 text-xs mb-1 ${
                      msg.senderType === "admin"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {msg.senderType === "customer" ? (
                      <User className="w-3 h-3" />
                    ) : msg.senderType === "ai" ? (
                      <Bot className="w-3 h-3" />
                    ) : (
                      <UserCheck className="w-3 h-3" />
                    )}
                    {msg.senderType === "customer"
                      ? "Customer"
                      : msg.senderType === "ai"
                      ? "AI"
                      : "Admin"}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderType === "admin" ? "text-white/50" : "text-gray-300"
                    }`}
                  >
                    {format(new Date(msg.createdAt), "HH:mm", { locale: th })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Quick Responses */}
          {showQuickResponses && quickResponses.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickResponses.map((qr) => (
                <Button
                  key={qr.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickResponse(qr.content)}
                  className="text-xs"
                >
                  {qr.title}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuickResponses(!showQuickResponses)}
              className={showQuickResponses ? "text-primary" : ""}
            >
              <Zap className="w-5 h-5" />
            </Button>

            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                emitTypingStart(parseInt(id!));
              }}
              onBlur={() => emitTypingStop(parseInt(id!))}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 min-h-[44px] max-h-32 resize-none"
              rows={1}
            />

            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {conversation.mode === "ai" && (
            <p className="text-xs text-amber-600 mt-2 text-center">
              AI mode is active. Switch to Human or Hybrid to respond manually.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
