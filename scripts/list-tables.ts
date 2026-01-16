import pg from "pg";

async function listTables() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log("Tables in database:");
  result.rows.forEach((r) => console.log("  - " + r.table_name));
  await pool.end();
}

listTables();
