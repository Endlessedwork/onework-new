import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import * as fs from "fs";
import bcrypt from "bcrypt";

const { Pool } = pg;

async function seedProduction() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  // Check if data already exists
  const existingProducts = await db.select().from(schema.products);
  if (existingProducts.length > 0) {
    console.log("Database already has data, skipping seed");
    await pool.end();
    return;
  }

  console.log("Seeding production database...");

  // Load seed data
  const seedData = JSON.parse(fs.readFileSync("scripts/seed-data.json", "utf-8"));

  // Seed categories
  if (seedData.categories.length > 0) {
    for (const cat of seedData.categories) {
      const { id, createdAt, updatedAt, ...catData } = cat;
      await db.insert(schema.categories).values(catData).onConflictDoNothing();
    }
    console.log(`Seeded ${seedData.categories.length} categories`);
  }

  // Seed products
  if (seedData.products.length > 0) {
    for (const prod of seedData.products) {
      const { id, createdAt, updatedAt, ...prodData } = prod;
      await db.insert(schema.products).values(prodData).onConflictDoNothing();
    }
    console.log(`Seeded ${seedData.products.length} products`);
  }

  // Seed settings
  if (seedData.settings.length > 0) {
    for (const setting of seedData.settings) {
      const { id, updatedAt, ...settingData } = setting;
      await db.insert(schema.settings).values({
        ...settingData,
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
      }).onConflictDoNothing();
    }
    console.log(`Seeded ${seedData.settings.length} settings`);
  }

  // Seed chatbot settings
  if (seedData.chatbotSettings.length > 0) {
    for (const cs of seedData.chatbotSettings) {
      const { id, updatedAt, ...csData } = cs;
      await db.insert(schema.chatbotSettings).values({
        ...csData,
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
      }).onConflictDoNothing();
    }
    console.log(`Seeded ${seedData.chatbotSettings.length} chatbot settings`);
  }

  // Seed training data
  if (seedData.chatbotTrainingData.length > 0) {
    for (const td of seedData.chatbotTrainingData) {
      const { id, createdAt, updatedAt, ...tdData } = td;
      await db.insert(schema.chatbotTrainingData).values(tdData).onConflictDoNothing();
    }
    console.log(`Seeded ${seedData.chatbotTrainingData.length} training data`);
  }

  // Create admin user if not exists
  const existingAdmin = await db.select().from(schema.users);
  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(schema.users).values({
      username: "admin",
      password: hashedPassword,
    });
    console.log("Created admin user (username: admin, password: admin123)");
  }

  console.log("Seed completed!");
  await pool.end();
}

seedProduction().catch(console.error);
