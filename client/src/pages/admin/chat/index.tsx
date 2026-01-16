import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  User,
  Bot,
  UserCheck,
  Globe,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Conversation } from "@shared/schema";
import { useAdminChatSocket } from "@/hooks/useChatSocket";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

export default function AdminChatDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Build query params
  const params = new URLSearchParams();
  if (statusFilter !== "all") params.set("status", statusFilter);
  if (channelFilter !== "all") params.set("channel", channelFilter);
  if (searchQuery) params.set("search", searchQuery);

  const { data, isLoading, refetch } = useQuery<{
    conversations: Conversation[];
    total: number;
  }>({
    queryKey: ["/api/admin/chat/conversations", statusFilter, channelFilter, searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/chat/conversations?${params.toString()}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // WebSocket for real-time updates
  const handleNewConversation = useCallback((conversation: Conversation) => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/conversations"] });
  }, [queryClient]);

  const handleNewMessage = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/conversations"] });
  }, [queryClient]);

  useAdminChatSocket({
    onNewConversation: handleNewConversation,
    onNewMessage: handleNewMessage,
  });

  const conversations = data?.conversations || [];
  const total = data?.total || 0;

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "ai":
        return <Bot className="w-4 h-4" />;
      case "human":
        return <UserCheck className="w-4 h-4" />;
      case "hybrid":
        return (
          <div className="flex">
            <Bot className="w-4 h-4" />
            <UserCheck className="w-4 h-4 -ml-1" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
              <p className="text-sm text-gray-500">{total} conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/chat/line-settings">
              <Button variant="outline">LINE Settings</Button>
            </Link>
            <Link href="/admin/chat/quick-responses">
              <Button variant="outline">Quick Responses</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="line">LINE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conversation List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400">
                Conversations will appear here when customers start chatting
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/admin/chat/${conversation.id}`}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {conversation.channel === "line" ? (
                            <Globe className="w-6 h-6 text-green-500" />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {conversation.customerName || "Anonymous"}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {conversation.customerEmail || conversation.customerPhone || "No contact info"}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              {getModeIcon(conversation.mode)}
                              {conversation.mode === "ai"
                                ? "AI"
                                : conversation.mode === "human"
                                ? "Human"
                                : "Hybrid"}
                            </span>
                            <span>•</span>
                            <span>{conversation.totalMessages} messages</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {conversation.lastMessageAt
                                ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                                    addSuffix: true,
                                    locale: th,
                                  })
                                : "Never"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Channel */}
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(conversation.status)}
                        <Badge variant="outline" className="text-xs">
                          {conversation.channel === "line" ? "LINE" : "Web"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
