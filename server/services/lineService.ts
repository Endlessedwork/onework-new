import * as line from "@line/bot-sdk";
import crypto from "crypto";
import { db } from "../db";
import {
  lineSettings,
  conversations,
  messages,
  type LineSettings,
} from "@shared/models/chat";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { notifyNewConversation, notifyNewMessage } from "../websocket";

// Cache LINE client to avoid re-creating on every request
let lineClient: line.messagingApi.MessagingApiClient | null = null;
let cachedSettings: LineSettings | null = null;

/**
 * Get LINE settings from database
 */
export async function getLineSettings(): Promise<LineSettings | null> {
  const [settings] = await db.select().from(lineSettings).limit(1);
  return settings || null;
}

/**
 * Update LINE settings
 */
export async function updateLineSettings(
  data: Partial<LineSettings>
): Promise<LineSettings> {
  const existing = await getLineSettings();

  if (existing) {
    const [updated] = await db
      .update(lineSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lineSettings.id, existing.id))
      .returning();
    cachedSettings = null; // Clear cache
    lineClient = null; // Force re-create client
    return updated;
  } else {
    const [created] = await db
      .insert(lineSettings)
      .values(data as any)
      .returning();
    cachedSettings = null;
    lineClient = null;
    return created;
  }
}

/**
 * Get or create LINE client
 */
async function getLineClient(): Promise<line.messagingApi.MessagingApiClient | null> {
  if (lineClient) return lineClient;

  const settings = await getLineSettings();
  if (!settings?.channelAccessToken || !settings?.isActive) {
    return null;
  }

  cachedSettings = settings;
  lineClient = new line.messagingApi.MessagingApiClient({
    channelAccessToken: settings.channelAccessToken,
  });

  return lineClient;
}

/**
 * Verify LINE webhook signature
 */
export function verifySignature(
  body: string,
  signature: string,
  channelSecret: string
): boolean {
  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}

/**
 * Handle incoming LINE webhook events
 */
export async function handleLineWebhook(
  events: line.WebhookEvent[],
  channelSecret: string
): Promise<void> {
  for (const event of events) {
    try {
      await handleEvent(event);
    } catch (error) {
      console.error("Error handling LINE event:", error);
    }
  }
}

/**
 * Handle a single LINE event
 */
async function handleEvent(event: line.WebhookEvent): Promise<void> {
  // Only handle message events for now
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const userId = event.source.userId;
  if (!userId) return;

  const messageText = event.message.text;

  // Find or create conversation for this LINE user
  let [conversation] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.lineUserId, userId),
        eq(conversations.channel, "line"),
        eq(conversations.status, "active")
      )
    )
    .limit(1);

  if (!conversation) {
    // Get user profile from LINE
    let displayName = "LINE User";
    try {
      const client = await getLineClient();
      if (client) {
        const profile = await client.getProfile(userId);
        displayName = profile.displayName;
      }
    } catch (e) {
      console.error("Failed to get LINE profile:", e);
    }

    // Create new conversation
    const sessionId = `line_${uuidv4()}`;
    [conversation] = await db
      .insert(conversations)
      .values({
        sessionId,
        customerName: displayName,
        channel: "line",
        lineUserId: userId,
        status: "active",
        mode: "ai", // Start with AI mode
      })
      .returning();

    // Notify admins
    notifyNewConversation(conversation);
  }

  // Save user message
  const [userMessage] = await db
    .insert(messages)
    .values({
      conversationId: conversation.id,
      role: "user",
      content: messageText,
      senderType: "customer",
      isRead: false,
    })
    .returning();

  // Update conversation metrics
  await db
    .update(conversations)
    .set({
      lastMessageAt: new Date(),
      totalMessages: conversation.totalMessages + 1,
      unreadCount: conversation.unreadCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversation.id));

  // Notify admins
  notifyNewMessage(conversation.id, conversation.sessionId, userMessage);

  // Check if auto-reply is enabled and mode allows AI
  const settings = await getLineSettings();
  if (
    settings?.autoReplyEnabled &&
    (conversation.mode === "ai" || conversation.mode === "hybrid")
  ) {
    // Import OpenAI dynamically to avoid circular dependency
    const { generateAIResponse } = await import("./chatService");

    try {
      // Get conversation history for context
      const history = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversation.id))
        .orderBy(messages.createdAt)
        .limit(10);

      // Generate AI response
      const aiResponseText = await generateAIResponse(history, messageText);

      if (aiResponseText) {
        // Save AI message to database
        const [aiMessage] = await db
          .insert(messages)
          .values({
            conversationId: conversation.id,
            role: "assistant",
            content: aiResponseText,
            senderType: "ai",
            isRead: true,
          })
          .returning();

        // Update conversation metrics
        await db
          .update(conversations)
          .set({
            lastMessageAt: new Date(),
            totalMessages: conversation.totalMessages + 2,
            aiMessages: (conversation.aiMessages || 0) + 1,
            updatedAt: new Date(),
          })
          .where(eq(conversations.id, conversation.id));

        // Send reply to LINE
        await sendLineMessage(userId, aiResponseText);

        // Notify admins
        notifyNewMessage(conversation.id, conversation.sessionId, aiMessage);
      }
    } catch (error) {
      console.error("Failed to generate/send AI response:", error);
    }
  }
}

/**
 * Send a message to LINE user
 */
export async function sendLineMessage(
  userId: string,
  text: string
): Promise<boolean> {
  const client = await getLineClient();
  if (!client) {
    console.error("LINE client not available");
    return false;
  }

  try {
    await client.pushMessage({
      to: userId,
      messages: [{ type: "text", text }],
    });
    return true;
  } catch (error) {
    console.error("Failed to send LINE message:", error);
    return false;
  }
}

/**
 * Send a message from admin to LINE user via conversation
 */
export async function sendAdminMessageToLine(
  conversationId: number,
  content: string
): Promise<boolean> {
  // Get conversation
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conversation?.lineUserId || conversation.channel !== "line") {
    return false;
  }

  return sendLineMessage(conversation.lineUserId, content);
}

/**
 * Test LINE connection
 */
export async function testLineConnection(): Promise<{
  success: boolean;
  error?: string;
  botInfo?: any;
}> {
  try {
    const client = await getLineClient();
    if (!client) {
      return { success: false, error: "LINE is not configured or inactive" };
    }

    const botInfo = await client.getBotInfo();
    return { success: true, botInfo };
  } catch (error: any) {
    return { success: false, error: error.message || "Connection failed" };
  }
}
