import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useCustomerChatSocket } from "@/hooks/useChatSocket";
import type { Message as DBMessage, Conversation } from "@shared/schema";

const SESSION_KEY = "onework_chat_session";

interface UIMessage {
  id: number;
  content: string;
  senderType: "customer" | "ai" | "admin";
  timestamp: Date;
}

export default function Chatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // Default to active
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [mode, setMode] = useState<string>("ai");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      setSessionId(savedSession);
    }
  }, []);

  // Fetch chatbot settings
  useEffect(() => {
    fetchSettings();
  }, [language]);

  // Start/resume chat when opening
  useEffect(() => {
    if (isOpen && !conversation) {
      startChat();
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle new message from WebSocket
  const handleNewMessage = useCallback((message: DBMessage) => {
    // Only add if from AI or Admin
    if (message.senderType === "ai" || message.senderType === "admin") {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, {
          id: message.id,
          content: message.content,
          senderType: message.senderType as "ai" | "admin",
          timestamp: new Date(message.createdAt),
        }];
      });
      setIsLoading(false);
    }
  }, []);

  // Handle conversation mode update
  const handleConversationUpdated = useCallback((data: { mode?: string }) => {
    if (data.mode) {
      setMode(data.mode);
    }
  }, []);

  // Connect to WebSocket
  useCustomerChatSocket(sessionId, {
    onNewMessage: handleNewMessage,
    onConversationUpdated: handleConversationUpdated,
  });

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/settings?lang=${language}`);
      if (response.ok) {
        const data = await response.json();
        setIsActive(data.isActive);
      } else {
        // Fallback: still show chatbot if endpoint fails
        setIsActive(true);
      }
    } catch (error) {
      console.error("Failed to fetch chatbot settings:", error);
      setIsActive(true); // Show anyway
    }
  };

  const startChat = async () => {
    try {
      const response = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newSessionId = data.conversation.sessionId;

        setSessionId(newSessionId);
        setConversation(data.conversation);
        setMode(data.conversation.mode);
        localStorage.setItem(SESSION_KEY, newSessionId);

        // Convert DB messages to UI messages
        const uiMessages: UIMessage[] = data.messages.map((m: DBMessage) => ({
          id: m.id,
          content: m.content,
          senderType: m.senderType as "customer" | "ai" | "admin",
          timestamp: new Date(m.createdAt),
        }));

        // Add welcome message if new conversation
        if (data.isNew || uiMessages.length === 0) {
          const welcomeMsg: UIMessage = {
            id: Date.now(),
            content: language === "en"
              ? "Hello! Welcome to Onework. How can I help you today?"
              : "สวัสดีครับ! ยินดีต้อนรับสู่ Onework มีอะไรให้ช่วยไหมครับ?",
            senderType: "ai",
            timestamp: new Date(),
          };
          setMessages([welcomeMsg]);
        } else {
          setMessages(uiMessages);
        }
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
      // Show fallback welcome
      setMessages([{
        id: Date.now(),
        content: language === "en"
          ? "Hello! How can I help you?"
          : "สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?",
        senderType: "ai",
        timestamp: new Date(),
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !sessionId) return;

    const userMessage: UIMessage = {
      id: Date.now(),
      content: inputValue.trim(),
      senderType: "customer",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          content: userMessage.content,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // If AI responded, add the message (check for duplicates)
        if (data.aiMessage) {
          setMessages(prev => {
            // Avoid duplicate - WebSocket might have already added it
            if (prev.some(m => m.id === data.aiMessage.id)) {
              return prev;
            }
            return [...prev, {
              id: data.aiMessage.id,
              content: data.aiMessage.content,
              senderType: "ai",
              timestamp: new Date(data.aiMessage.createdAt),
            }];
          });
          setIsLoading(false);
        } else {
          // In human mode, wait for admin response via WebSocket
          // Keep loading state if no AI response
          if (mode === "human") {
            // In human mode, loading indicator stays until admin replies
          } else {
            setIsLoading(false);
          }
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: UIMessage = {
        id: Date.now() + 1,
        content: language === "en"
          ? "Connection error. Please try again."
          : "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง",
        senderType: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case "customer":
        return <User className="w-3 h-3" />;
      case "ai":
        return <Bot className="w-3 h-3" />;
      case "admin":
        return <UserCheck className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold">Onework Support</h3>
                  <p className="text-xs text-white/80">
                    {mode === "human"
                      ? (language === "en" ? "Chatting with support" : "กำลังคุยกับเจ้าหน้าที่")
                      : (language === "en" ? "AI Assistant" : "AI ช่วยเหลือ")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      message.senderType === "customer"
                        ? "bg-primary text-white rounded-br-sm"
                        : message.senderType === "admin"
                        ? "bg-green-50 border border-green-200 text-gray-800 rounded-bl-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                    data-testid={`message-${message.senderType}-${message.id}`}
                  >
                    {message.senderType !== "customer" && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                        {getSenderIcon(message.senderType)}
                        <span>
                          {message.senderType === "admin"
                            ? (language === "en" ? "Support" : "เจ้าหน้าที่")
                            : "AI"}
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={language === "en" ? "Type your message..." : "พิมพ์ข้อความของคุณ..."}
                  disabled={isLoading}
                  className="flex-1 rounded-full border-gray-200 focus:border-primary"
                  data-testid="input-chat-message"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="rounded-full shrink-0"
                  data-testid="button-send-message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors"
        data-testid="button-open-chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
