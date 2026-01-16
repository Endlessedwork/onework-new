import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  const migrationPath = path.join(__dirname, "../migrations/0001_chat_system.sql");
  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log("Running chat system migration...");

  try {
    await pool.query(sql);
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
