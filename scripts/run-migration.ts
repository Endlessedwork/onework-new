import pg from "pg";
import * as fs from "fs";

const { Pool } = pg;

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Read and execute SQL migration
    const sql = fs.readFileSync("scripts/migrate-chat.sql", "utf-8");
    await pool.query(sql);
    console.log("Chat tables migration completed successfully");
  } catch (error: any) {
    // Ignore "already exists" errors
    if (error.code === "42P07") {
      console.log("Tables already exist, skipping migration");
    } else {
      console.error("Migration error:", error.message);
    }
  } finally {
    await pool.end();
  }
}

runMigration();
