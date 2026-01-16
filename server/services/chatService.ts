import { db } from "../db";
import {
  conversations,
  messages,
  lineSettings,
  chatQuickResponses,
  type Conversation,
  type Message,
  type InsertConversation,
  type InsertMessage,
  type LineSettings,
  type QuickResponse,
  type InsertQuickResponse,
  type StartChatInput,
  type SendMessageInput,
  type UpdateConversationInput,
} from "@shared/schema";
import { eq, desc, sql, and, ilike } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { notifyNewConversation, notifyNewMessage, notifyConversationUpdated } from "../websocket";

// ============================================================
// CONVERSATION OPERATIONS
// ============================================================

/**
 * เริ่มหรือ resume conversation
 * - ถ้ามี sessionId จะ resume
 * - ถ้าไม่มีจะสร้างใหม่
 */
export async function startConversation(
  input: StartChatInput
): Promise<{ conversation: Conversation; messages: Message[]; isNew: boolean }> {
  const sessionId = input.sessionId || uuidv4();

  // Check if conversation exists
  const [existing] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId));

  if (existing) {
    // Resume - get messages
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, existing.id))
      .orderBy(messages.createdAt);

    return { conversation: existing, messages: msgs, isNew: false };
  }

  // Create new conversation
  const [conversation] = await db
    .insert(conversations)
    .values({
      sessionId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      channel: input.channel || "web",
      lineUserId: input.lineUserId,
      status: "active",
      mode: "ai",
    })
    .returning();

  // Notify admins of new conversation
  notifyNewConversation(conversation);

  return { conversation, messages: [], isNew: true };
}

/**
 * ส่งข้อความจากลูกค้าและรับคำตอบจาก AI
 */
export async function sendMessage(
  input: SendMessageInput,
  openai?: OpenAI | null
): Promise<{ userMessage: Message; aiMessage?: Message }> {
  // Find conversation by sessionId
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, input.sessionId));

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Save user message
  const [userMessage] = await db
    .insert(messages)
    .values({
      conversationId: conversation.id,
      role: "user",
      content: input.content,
      senderType: "customer",
      isRead: false,
    })
    .returning();

  // Update conversation metrics
  await db
    .update(conversations)
    .set({
      lastMessageAt: new Date(),
      totalMessages: sql`${conversations.totalMessages} + 1`,
      unreadCount: sql`${conversations.unreadCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversation.id));

  // Notify admins of new message
  notifyNewMessage(conversation.id, conversation.sessionId, userMessage);

  // Generate AI response if mode allows
  if (conversation.mode !== "human" && openai) {
    try {
      const aiContent = await generateAIResponseInternal(conversation.id, openai);

      const [aiMessage] = await db
        .insert(messages)
        .values({
          conversationId: conversation.id,
          role: "assistant",
          content: aiContent,
          senderType: "ai",
          isRead: true,
        })
        .returning();

      // Update AI message count
      await db
        .update(conversations)
        .set({
          totalMessages: sql`${conversations.totalMessages} + 1`,
          aiMessages: sql`${conversations.aiMessages} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, conversation.id));

      // Notify customer of AI response
      notifyNewMessage(conversation.id, conversation.sessionId, aiMessage);

      return { userMessage, aiMessage };
    } catch (error) {
      console.error("AI response error:", error);
      // Return without AI message on error
      return { userMessage };
    }
  }

  return { userMessage };
}

/**
 * Generate AI response using OpenAI - internal use
 */
async function generateAIResponseInternal(
  conversationId: number,
  openai: OpenAI
): Promise<string> {
  // Get conversation history
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  // Build messages for OpenAI
  const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a helpful female customer support assistant for OneWork, a hotel amenities and supplies company.

Key information:
- We provide premium hotel amenities including toiletries, bath products, and room supplies
- We have multiple product collections: Sea Breeze, Bloom, Lavender, Spa Therapy, and more
- Contact: 062-862-8877 or contact@oneworkproduct.com
- Line: @onework
- Location: Samut Prakan, Thailand

IMPORTANT: You are FEMALE. When speaking Thai, always use "ค่ะ" (ka) - NEVER use "ครับ" (krub) or "ครับ/ค่ะ".
Be friendly, helpful, and concise. Answer in the same language as the customer (Thai or English).`,
    },
    ...history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: chatMessages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "ขออภัยครับ ไม่สามารถตอบได้ในขณะนี้";
}

/**
 * Generate AI response from message history (for LINE integration)
 * Exported for use by lineService
 */
export async function generateAIResponse(
  history: Message[],
  userMessage: string
): Promise<string | null> {
  // Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured");
    return null;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a helpful female customer support assistant for OneWork, a hotel amenities and supplies company.

Key information:
- We provide premium hotel amenities including toiletries, bath products, and room supplies
- We have multiple product collections: Sea Breeze, Bloom, Lavender, Spa Therapy, and more
- Contact: 062-862-8877 or contact@oneworkproduct.com
- Line: @onework
- Location: Samut Prakan, Thailand

IMPORTANT: You are FEMALE. When speaking Thai, always use "ค่ะ" (ka) - NEVER use "ครับ" (krub) or "ครับ/ค่ะ".
Be friendly, helpful, and concise. Answer in the same language as the customer (Thai or English).`,
    },
    ...history.map((msg) => ({
      role: (msg.senderType === "customer" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}

/**
 * ดึงประวัติแชทตาม sessionId
 */
export async function getChatHistory(
  sessionId: string
): Promise<{ conversation: Conversation | null; messages: Message[] }> {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId));

  if (!conversation) {
    return { conversation: null, messages: [] };
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversation.id))
    .orderBy(messages.createdAt);

  return { conversation, messages: msgs };
}

// ============================================================
// ADMIN OPERATIONS
// ============================================================

export interface ConversationFilter {
  status?: "active" | "closed" | "archived";
  channel?: "web" | "line";
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * ดึงรายการ conversations สำหรับ Admin
 */
export async function getConversations(
  filter: ConversationFilter = {}
): Promise<{ conversations: Conversation[]; total: number }> {
  const { status, channel, search, limit = 20, offset = 0 } = filter;

  let query = db.select().from(conversations);
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(conversations);

  const conditions = [];

  if (status) {
    conditions.push(eq(conversations.status, status));
  }

  if (channel) {
    conditions.push(eq(conversations.channel, channel));
  }

  if (search) {
    conditions.push(
      ilike(conversations.customerName, `%${search}%`)
    );
  }

  if (conditions.length > 0) {
    const whereClause = and(...conditions);
    // @ts-ignore - drizzle typing issue
    query = query.where(whereClause);
    // @ts-ignore
    countQuery = countQuery.where(whereClause);
  }

  const [countResult] = await countQuery;
  const total = Number(countResult?.count || 0);

  // @ts-ignore
  const items = await query
    .orderBy(desc(conversations.lastMessageAt))
    .limit(limit)
    .offset(offset);

  return { conversations: items, total };
}

/**
 * ดึง conversation พร้อม messages
 */
export async function getConversationById(
  id: number
): Promise<{ conversation: Conversation | null; messages: Message[] }> {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));

  if (!conversation) {
    return { conversation: null, messages: [] };
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  return { conversation, messages: msgs };
}

/**
 * อัพเดท conversation (status, mode, customer info)
 */
export async function updateConversation(
  id: number,
  input: UpdateConversationInput
): Promise<Conversation | null> {
  const [updated] = await db
    .update(conversations)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, id))
    .returning();

  if (updated) {
    // Notify about conversation update
    notifyConversationUpdated(id, updated.sessionId, input);
  }

  return updated || null;
}

/**
 * ลบ conversation และ messages (cascade)
 */
export async function deleteConversation(id: number): Promise<boolean> {
  const result = await db.delete(conversations).where(eq(conversations.id, id));
  return (result.rowCount ?? 0) > 0;
}

/**
 * Admin ส่งข้อความ
 */
export async function adminSendMessage(
  conversationId: number,
  content: string,
  adminId: number
): Promise<Message> {
  // Get conversation for sessionId
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      role: "admin",
      content,
      senderType: "admin",
      senderId: adminId,
      isRead: true,
    })
    .returning();

  // Update conversation metrics
  await db
    .update(conversations)
    .set({
      lastMessageAt: new Date(),
      totalMessages: sql`${conversations.totalMessages} + 1`,
      humanMessages: sql`${conversations.humanMessages} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId));

  // Notify customer of admin message
  notifyNewMessage(conversationId, conversation.sessionId, message);

  // If this is a LINE conversation, also send to LINE
  if (conversation.channel === "line" && conversation.lineUserId) {
    // Import LINE service dynamically to avoid circular dependency
    const { sendAdminMessageToLine } = await import("./lineService");
    await sendAdminMessageToLine(conversationId, content);
  }

  return message;
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: number): Promise<void> {
  await db
    .update(messages)
    .set({ isRead: true })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.isRead, false)
      )
    );

  await db
    .update(conversations)
    .set({ unreadCount: 0 })
    .where(eq(conversations.id, conversationId));
}

// ============================================================
// QUICK RESPONSES
// ============================================================

export async function getQuickResponses(): Promise<QuickResponse[]> {
  return db
    .select()
    .from(chatQuickResponses)
    .where(eq(chatQuickResponses.isActive, true))
    .orderBy(chatQuickResponses.sortOrder);
}

export async function getAllQuickResponses(): Promise<QuickResponse[]> {
  return db.select().from(chatQuickResponses).orderBy(chatQuickResponses.sortOrder);
}

export async function createQuickResponse(
  data: InsertQuickResponse
): Promise<QuickResponse> {
  const [response] = await db
    .insert(chatQuickResponses)
    .values(data)
    .returning();
  return response;
}

export async function updateQuickResponse(
  id: number,
  data: Partial<InsertQuickResponse>
): Promise<QuickResponse | null> {
  const [response] = await db
    .update(chatQuickResponses)
    .set(data)
    .where(eq(chatQuickResponses.id, id))
    .returning();
  return response || null;
}

export async function deleteQuickResponse(id: number): Promise<boolean> {
  const result = await db
    .delete(chatQuickResponses)
    .where(eq(chatQuickResponses.id, id));
  return (result.rowCount ?? 0) > 0;
}

// ============================================================
// LINE SETTINGS
// ============================================================

export async function getLineSettings(): Promise<LineSettings | null> {
  const [settings] = await db.select().from(lineSettings);
  return settings || null;
}

export async function updateLineSettings(
  data: Partial<LineSettings>
): Promise<LineSettings> {
  const existing = await getLineSettings();

  if (existing) {
    const [updated] = await db
      .update(lineSettings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(lineSettings.id, existing.id))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(lineSettings)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .returning();
    return created;
  }
}
