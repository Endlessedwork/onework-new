import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import * as fs from "fs";

const { Pool } = pg;

async function exportData() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  const allProducts = await db.select().from(schema.products);
  const allCategories = await db.select().from(schema.categories);
  const allSettings = await db.select().from(schema.settings);
  const allChatbotSettings = await db.select().from(schema.chatbotSettings);
  const allTrainingData = await db.select().from(schema.chatbotTrainingData);

  const data = {
    products: allProducts,
    categories: allCategories,
    settings: allSettings,
    chatbotSettings: allChatbotSettings,
    chatbotTrainingData: allTrainingData,
  };

  fs.writeFileSync("scripts/seed-data.json", JSON.stringify(data, null, 2));
  console.log("Exported data to scripts/seed-data.json");
  console.log(`- ${allProducts.length} products`);
  console.log(`- ${allCategories.length} categories`);
  console.log(`- ${allSettings.length} settings`);
  console.log(`- ${allChatbotSettings.length} chatbot settings`);
  console.log(`- ${allTrainingData.length} training data`);

  await pool.end();
}

exportData().catch(console.error);
