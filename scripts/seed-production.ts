import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import * as fs from "fs";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const { Pool } = pg;
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedProduction() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  // Check if admin user exists (most critical piece)
  const existingUsers = await db.select().from(schema.users);

  if (existingUsers.length > 0) {
    console.log("Database already has admin user, skipping full seed");
    await pool.end();
    return;
  }

  console.log("Seeding production database...");

  // Clear ALL existing data for fresh start
  console.log("Clearing existing data...");
  await db.delete(schema.chatbotTrainingData);
  await db.delete(schema.chatbotSettings);
  await db.delete(schema.settings);
  await db.delete(schema.products);
  await db.delete(schema.categories);

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

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  await db.insert(schema.users).values({
    username: "admin",
    password: hashedPassword,
  });
  console.log("Created admin user (username: admin, password: admin123)");

  console.log("Seed completed!");
  await pool.end();
}

seedProduction().catch(console.error);
