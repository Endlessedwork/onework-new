import { pool } from "./db";

export async function runChatMigration() {
  try {
    console.log("Running chat tables migration...");

    // Check if conversations table has the correct schema
    const columnsCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'conversations'
    `);
    const columns = columnsCheck.rows.map(r => r.column_name);

    // If table exists but doesn't have session_id, drop and recreate
    if (columns.length > 0 && !columns.includes("session_id")) {
      console.log("Old conversations table detected, dropping old chat tables...");
      await pool.query(`DROP TABLE IF EXISTS messages CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS conversations CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS line_settings CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS chat_quick_responses CASCADE`);
      console.log("Old tables dropped, creating new schema...");
    }

    // Create conversations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        channel TEXT NOT NULL DEFAULT 'web',
        line_user_id TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        mode TEXT NOT NULL DEFAULT 'ai',
        assigned_to INTEGER,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unread_count INTEGER NOT NULL DEFAULT 0,
        total_messages INTEGER NOT NULL DEFAULT 0,
        ai_messages INTEGER NOT NULL DEFAULT 0,
        human_messages INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        sender_type TEXT NOT NULL DEFAULT 'customer',
        sender_id INTEGER,
        metadata JSONB,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create line_settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS line_settings (
        id SERIAL PRIMARY KEY,
        channel_id TEXT,
        channel_secret TEXT,
        channel_access_token TEXT,
        webhook_url TEXT,
        is_active BOOLEAN NOT NULL DEFAULT false,
        auto_reply_enabled BOOLEAN NOT NULL DEFAULT true,
        quick_replies JSONB,
        line_oa_url TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create chat_quick_responses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_quick_responses (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        shortcut TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`);

    console.log("Chat tables migration completed!");
  } catch (error: any) {
    console.error("Migration error:", error.message);
  }
}
