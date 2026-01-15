import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Will store hashed password
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  nameTh: text("name_th").notNull(),
  collection: text("collection").notNull(),
  collectionEn: text("collection_en").notNull(),
  collectionTh: text("collection_th").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionTh: text("description_th"),
  category: text("category"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Website Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

// Categories table for product categorization
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  nameTh: text("name_th").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Re-export chat models
export * from "./models/chat";

// Chatbot settings table
export const chatbotSettings = pgTable("chatbot_settings", {
  id: serial("id").primaryKey(),
  modelName: text("model_name").notNull().default("gpt-5"),
  systemPrompt: text("system_prompt").notNull().default("You are a helpful assistant for a hotel amenities supplier. Answer questions about products, pricing, and services."),
  welcomeMessage: text("welcome_message").notNull().default("สวัสดีครับ! ยินดีต้อนรับสู่ Onework มีอะไรให้ช่วยไหมครับ?"),
  welcomeMessageEn: text("welcome_message_en").notNull().default("Hello! Welcome to Onework. How can I help you today?"),
  isActive: boolean("is_active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChatbotSettingsSchema = createInsertSchema(chatbotSettings).omit({
  id: true,
  updatedAt: true,
});
export type InsertChatbotSettings = z.infer<typeof insertChatbotSettingsSchema>;
export type ChatbotSettings = typeof chatbotSettings.$inferSelect;

// Chatbot training data table
export const chatbotTrainingData = pgTable("chatbot_training_data", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChatbotTrainingDataSchema = createInsertSchema(chatbotTrainingData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertChatbotTrainingData = z.infer<typeof insertChatbotTrainingDataSchema>;
export type ChatbotTrainingData = typeof chatbotTrainingData.$inferSelect;
