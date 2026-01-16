-- Chat System Migration
-- Drop old conversations/messages tables if they exist (schema changed significantly)
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "conversations" CASCADE;

-- Create new conversations table
CREATE TABLE "conversations" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_id" text NOT NULL,
  "customer_name" text,
  "customer_email" text,
  "customer_phone" text,
  "channel" text DEFAULT 'web' NOT NULL,
  "line_user_id" text,
  "status" text DEFAULT 'active' NOT NULL,
  "mode" text DEFAULT 'ai' NOT NULL,
  "assigned_to" integer,
  "last_message_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "unread_count" integer DEFAULT 0 NOT NULL,
  "total_messages" integer DEFAULT 0 NOT NULL,
  "ai_messages" integer DEFAULT 0 NOT NULL,
  "human_messages" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT "conversations_session_id_unique" UNIQUE("session_id")
);

-- Create new messages table
CREATE TABLE "messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "conversation_id" integer NOT NULL,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "sender_type" text DEFAULT 'customer' NOT NULL,
  "sender_id" integer,
  "metadata" jsonb,
  "is_read" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add foreign key
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk"
  FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;

-- Create line_settings table
CREATE TABLE IF NOT EXISTS "line_settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "channel_id" text,
  "channel_secret" text,
  "channel_access_token" text,
  "webhook_url" text,
  "is_active" boolean DEFAULT false NOT NULL,
  "auto_reply_enabled" boolean DEFAULT true NOT NULL,
  "quick_replies" jsonb,
  "line_oa_url" text,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create chat_quick_responses table
CREATE TABLE IF NOT EXISTS "chat_quick_responses" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "category" text,
  "shortcut" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert default quick responses
INSERT INTO "chat_quick_responses" ("title", "content", "category", "shortcut", "sort_order") VALUES
('ทักทาย', 'สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?', 'greeting', '/hi', 1),
('ขอบคุณ', 'ขอบคุณที่ติดต่อมาครับ หากมีคำถามเพิ่มเติมสามารถสอบถามได้ตลอดเวลาครับ', 'closing', '/thanks', 2),
('ส่งต่อ LINE', 'สะดวกคุยต่อทาง LINE ไหมครับ? สามารถแอดไลน์ @onework เพื่อคุยต่อได้เลยครับ', 'redirect', '/line', 3),
('รอสักครู่', 'รอสักครู่นะครับ กำลังตรวจสอบข้อมูลให้ครับ', 'support', '/wait', 4),
('ติดต่อฝ่ายขาย', 'สำหรับใบเสนอราคาและรายละเอียดสินค้า สามารถติดต่อฝ่ายขายที่ 062-862-8877 หรือ contact@oneworkproduct.com ครับ', 'sales', '/sales', 5);

-- Insert default LINE settings row
INSERT INTO "line_settings" ("is_active", "auto_reply_enabled") VALUES (false, true)
ON CONFLICT DO NOTHING;
