import { pgTable, serial, integer, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// ============================================================
// CONVERSATIONS TABLE
// เก็บ session การสนทนาทั้งหมด รองรับ web และ LINE
// ============================================================
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(), // UUID สำหรับ identify session

  // Customer info
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),

  // Channel tracking
  channel: text("channel").notNull().default("web"), // 'web' | 'line'
  lineUserId: text("line_user_id"), // LINE user ID (if from LINE)

  // Status management
  status: text("status").notNull().default("active"), // 'active' | 'closed' | 'archived'
  mode: text("mode").notNull().default("ai"), // 'ai' | 'human' | 'hybrid'

  // Admin assignment (FK to users table - set via application logic)
  assignedTo: integer("assigned_to"),

  // Metrics
  lastMessageAt: timestamp("last_message_at").default(sql`CURRENT_TIMESTAMP`),
  unreadCount: integer("unread_count").default(0).notNull(),
  totalMessages: integer("total_messages").default(0).notNull(),
  aiMessages: integer("ai_messages").default(0).notNull(),
  humanMessages: integer("human_messages").default(0).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// ============================================================
// MESSAGES TABLE
// เก็บข้อความทุกอันในแต่ละ conversation
// ============================================================
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),

  // Message content
  role: text("role").notNull(), // 'user' | 'assistant' | 'admin' | 'system'
  content: text("content").notNull(),

  // Sender tracking
  senderType: text("sender_type").notNull().default("customer"), // 'customer' | 'ai' | 'admin'
  senderId: integer("sender_id"), // User ID if admin sent

  // Metadata (for attachments, LINE message info, etc.)
  metadata: jsonb("metadata").$type<{
    lineMessageId?: string;
    attachments?: { type: string; url: string }[];
    quickReplyUsed?: string;
  }>(),

  // Read tracking
  isRead: boolean("is_read").default(false).notNull(),

  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// ============================================================
// LINE SETTINGS TABLE
// ตั้งค่า LINE Official Account
// ============================================================
export const lineSettings = pgTable("line_settings", {
  id: serial("id").primaryKey(),

  // LINE credentials
  channelId: text("channel_id"),
  channelSecret: text("channel_secret"),
  channelAccessToken: text("channel_access_token"),

  // Webhook config
  webhookUrl: text("webhook_url"),

  // Settings
  isActive: boolean("is_active").default(false).notNull(),
  autoReplyEnabled: boolean("auto_reply_enabled").default(true).notNull(),

  // Quick replies (LINE specific)
  quickReplies: jsonb("quick_replies").$type<{
    label: string;
    text: string;
  }[]>(),

  // LINE OA URL สำหรับส่งให้ลูกค้า
  lineOaUrl: text("line_oa_url"),

  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// ============================================================
// CHAT QUICK RESPONSES TABLE
// คำตอบด่วนสำหรับ Admin
// ============================================================
export const chatQuickResponses = pgTable("chat_quick_responses", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(), // ชื่อแสดง
  content: text("content").notNull(), // เนื้อหาที่จะส่ง
  category: text("category"), // หมวดหมู่ (greeting, product, support, etc.)
  shortcut: text("shortcut"), // keyboard shortcut (e.g., "/hi")

  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),

  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// ============================================================
// ZOD SCHEMAS & TYPES
// ============================================================

// Conversation
export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

// Message
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// LINE Settings
export const insertLineSettingsSchema = createInsertSchema(lineSettings).omit({
  id: true,
  updatedAt: true,
});
export type LineSettings = typeof lineSettings.$inferSelect;
export type InsertLineSettings = z.infer<typeof insertLineSettingsSchema>;

// Quick Response
export const insertQuickResponseSchema = createInsertSchema(chatQuickResponses).omit({
  id: true,
  createdAt: true,
});
export type QuickResponse = typeof chatQuickResponses.$inferSelect;
export type InsertQuickResponse = z.infer<typeof insertQuickResponseSchema>;

// ============================================================
// CUSTOM VALIDATION SCHEMAS
// ============================================================

// สำหรับ start chat
export const startChatSchema = z.object({
  sessionId: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  channel: z.enum(["web", "line"]).default("web"),
  lineUserId: z.string().optional(),
});
export type StartChatInput = z.infer<typeof startChatSchema>;

// สำหรับ send message
export const sendMessageSchema = z.object({
  sessionId: z.string(),
  content: z.string().min(1),
  role: z.enum(["user", "assistant", "admin", "system"]).default("user"),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// สำหรับ admin update conversation
export const updateConversationSchema = z.object({
  status: z.enum(["active", "closed", "archived"]).optional(),
  mode: z.enum(["ai", "human", "hybrid"]).optional(),
  assignedTo: z.number().nullable().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
});
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
