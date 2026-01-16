import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { requireAuth, hashPassword } from "./auth";
import passport from "passport";
import { insertProductSchema, insertSettingSchema, insertUserSchema, insertCategorySchema, insertChatbotSettingsSchema, insertChatbotTrainingDataSchema, startChatSchema, sendMessageSchema, updateConversationSchema, insertQuickResponseSchema } from "@shared/schema";
import * as chatService from "./services/chatService";
import * as lineService from "./services/lineService";
import { fromZodError } from "zod-validation-error";
import { LocalStorageService, ObjectNotFoundError } from "./localStorage";
import multer from "multer";
import path from "path";
import OpenAI from "openai";

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const localStorageService = new LocalStorageService();
    cb(null, localStorageService.generateFilename(file.originalname));
  },
});

const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check endpoint for container orchestration
  app.get("/api/health", async (req, res) => {
    try {
      // Just check database connection (not query tables)
      await pool.query("SELECT 1");

      // Check if chat tables exist
      const tablesCheck = await pool.query(`
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations')
      `);
      const chatTablesExist = tablesCheck.rows[0]?.exists || false;

      // Get column names if table exists
      let conversationColumns: string[] = [];
      if (chatTablesExist) {
        const columnsResult = await pool.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'conversations' ORDER BY ordinal_position
        `);
        conversationColumns = columnsResult.rows.map(r => r.column_name);
      }

      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "2.1.0-chat",
        chatTablesExist
      });
    } catch (error) {
      res.status(503).json({ status: "unhealthy", error: "Database connection failed" });
    }
  });

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).send({ error: "Authentication error" });
      }
      if (!user) {
        return res.status(401).send({ error: info?.message || "Login failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).send({ error: "Login error" });
        }
        return res.send({ user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.send({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.send({ user: req.user });
    } else {
      res.status(401).send({ error: "Not authenticated" });
    }
  });

  // Initial setup route - create first admin user
  app.post("/api/auth/setup", async (req, res) => {
    try {
      // Check if any users exist
      const existingUser = await storage.getUserByUsername("admin");
      if (existingUser) {
        return res.status(400).send({ error: "Setup already completed" });
      }

      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const hashedPassword = await hashPassword(result.data.password);
      const user = await storage.createUser({
        ...result.data,
        password: hashedPassword,
      });

      res.send({ success: true, user: { id: user.id, username: user.username } });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Public products route (for frontend display)
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getActiveProducts();
      res.send(products);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin products routes
  app.get("/api/admin/products", requireAuth, async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.send(products);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.get("/api/admin/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }
      
      res.send(product);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.post("/api/admin/products", requireAuth, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const product = await storage.createProduct(result.data);
      res.send(product);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.patch("/api/admin/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertProductSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const product = await storage.updateProduct(id, result.data);
      
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }
      
      res.send(product);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.delete("/api/admin/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).send({ error: "Product not found" });
      }
      
      res.send({ success: true });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Settings routes
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.send(settings);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      
      if (!setting) {
        return res.status(404).send({ error: "Setting not found" });
      }
      
      res.send(setting);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.post("/api/admin/settings", requireAuth, async (req, res) => {
    try {
      const result = insertSettingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const setting = await storage.setSetting(
        result.data.key,
        result.data.value,
        result.data.description || undefined
      );
      
      res.send(setting);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Public categories route (for frontend display)
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getActiveCategories();
      res.send(categories);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin categories routes
  app.get("/api/admin/categories", requireAuth, async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.send(categories);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.get("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).send({ error: "Category not found" });
      }
      
      res.send(category);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.post("/api/admin/categories", requireAuth, async (req, res) => {
    try {
      const result = insertCategorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const category = await storage.createCategory(result.data);
      res.send(category);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.patch("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertCategorySchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const category = await storage.updateCategory(id, result.data);
      
      if (!category) {
        return res.status(404).send({ error: "Category not found" });
      }
      
      res.send(category);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.delete("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).send({ error: "Category not found" });
      }
      
      res.send({ success: true });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Local Storage routes for image upload
  app.post("/api/admin/upload", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: "No file uploaded" });
      }

      const localStorageService = new LocalStorageService();
      const url = localStorageService.getPublicUrl(req.file.filename);
      res.json({ url, filename: req.file.filename });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Serve uploaded files
  app.get("/uploads/:filename", async (req, res) => {
    const localStorageService = new LocalStorageService();
    try {
      await localStorageService.downloadFile(req.params.filename, res);
    } catch (error) {
      console.error("Error serving file:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Chatbot settings routes (admin)
  app.get("/api/admin/chatbot/settings", requireAuth, async (_req, res) => {
    try {
      const settings = await storage.getChatbotSettings();
      res.send(settings || {});
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.patch("/api/admin/chatbot/settings", requireAuth, async (req, res) => {
    try {
      const result = insertChatbotSettingsSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }
      const settings = await storage.updateChatbotSettings(result.data);
      res.send(settings);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Chatbot training data routes (admin)
  app.get("/api/admin/chatbot/training", requireAuth, async (_req, res) => {
    try {
      const data = await storage.getAllTrainingData();
      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.post("/api/admin/chatbot/training", requireAuth, async (req, res) => {
    try {
      const result = insertChatbotTrainingDataSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }
      const data = await storage.createTrainingData(result.data);
      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.patch("/api/admin/chatbot/training/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertChatbotTrainingDataSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }
      const data = await storage.updateTrainingData(id, result.data);
      if (!data) {
        return res.status(404).send({ error: "Training data not found" });
      }
      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.delete("/api/admin/chatbot/training/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTrainingData(id);
      if (!success) {
        return res.status(404).send({ error: "Training data not found" });
      }
      res.send({ success: true });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Public chatbot endpoint
  app.get("/api/chatbot/settings", async (req, res) => {
    try {
      const settings = await storage.getChatbotSettings();
      if (!settings || !settings.isActive) {
        return res.status(404).send({ error: "Chatbot not available" });
      }
      const lang = (req.query.lang as string) || "th";
      res.send({
        welcomeMessage: lang === "en" ? settings.welcomeMessageEn : settings.welcomeMessage,
        isActive: settings.isActive,
      });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  app.post("/api/chatbot/message", async (req, res) => {
    const { message, language = "th" } = req.body;
    try {
      if (!message) {
        return res.status(400).send({ error: "Message is required" });
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.warn("Chatbot: OPENAI_API_KEY not configured");
        return res.status(503).send({
          error: "Chatbot is not configured. Please set OPENAI_API_KEY.",
          reply: language === "en"
            ? "Sorry, the chatbot is currently unavailable. Please contact us directly."
            : "ขออภัย แชทบอทไม่พร้อมใช้งานขณะนี้ กรุณาติดต่อเราโดยตรง"
        });
      }

      const settings = await storage.getChatbotSettings();
      if (!settings || !settings.isActive) {
        return res.status(404).send({ error: "Chatbot not available" });
      }

      const trainingData = await storage.getActiveTrainingData();
      const products = await storage.getActiveProducts();

      const productContext = products.map(p =>
        language === "en"
          ? `- ${p.nameEn} (${p.collectionEn}): ${p.descriptionEn || "No description"}`
          : `- ${p.nameTh} (${p.collectionTh}): ${p.descriptionTh || "ไม่มีคำอธิบาย"}`
      ).join("\n");

      const trainingContext = trainingData.map(td =>
        `Q: ${td.question}\nA: ${td.answer}`
      ).join("\n\n");

      const systemPrompt = `${settings.systemPrompt}

Available Products:
${productContext}

${trainingContext ? `Reference Q&A:\n${trainingContext}` : ""}

IMPORTANT: Detect the language of the customer's message and respond in the SAME language. If they write in Thai, respond in Thai. If they write in English, respond in English.`;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const completion = await openai.chat.completions.create({
        model: settings.modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_completion_tokens: 500,
      });

      res.send({
        reply: completion.choices[0]?.message?.content || "ขออภัย ไม่สามารถตอบได้ในขณะนี้",
      });
    } catch (error: any) {
      console.error("Chatbot error:", error);
      const errorMessage = language === "th"
        ? "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
        : "Sorry, an error occurred. Please try again.";
      res.status(500).send({ error: "Failed to get response", reply: errorMessage });
    }
  });

  // ============================================================
  // CHAT SYSTEM ROUTES (New Persistent Chat)
  // ============================================================

  // Initialize OpenAI client if API key is available
  const openaiClient = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  // Public: Start or resume a chat conversation
  app.post("/api/chat/start", async (req, res) => {
    try {
      const result = startChatSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const data = await chatService.startConversation(result.data);
      res.send(data);
    } catch (error: any) {
      console.error("Start chat error:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Public: Send a message in the chat
  app.post("/api/chat/message", async (req, res) => {
    try {
      const result = sendMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const data = await chatService.sendMessage(result.data, openaiClient);
      res.send(data);
    } catch (error: any) {
      console.error("Chat message error:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Public: Get chat history by session ID
  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const data = await chatService.getChatHistory(req.params.sessionId);
      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // ============================================================
  // ADMIN CHAT ROUTES
  // ============================================================

  // Admin: List all conversations
  app.get("/api/admin/chat/conversations", requireAuth, async (req, res) => {
    try {
      const { status, channel, search, limit, offset } = req.query;
      const data = await chatService.getConversations({
        status: status as any,
        channel: channel as any,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Get conversation detail with messages
  app.get("/api/admin/chat/conversations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await chatService.getConversationById(id);

      if (!data.conversation) {
        return res.status(404).send({ error: "Conversation not found" });
      }

      // Mark messages as read
      await chatService.markMessagesAsRead(id);

      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Update conversation (status, mode, customer info)
  app.patch("/api/admin/chat/conversations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = updateConversationSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const conversation = await chatService.updateConversation(id, result.data);

      if (!conversation) {
        return res.status(404).send({ error: "Conversation not found" });
      }

      res.send(conversation);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Delete conversation
  app.delete("/api/admin/chat/conversations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await chatService.deleteConversation(id);

      if (!success) {
        return res.status(404).send({ error: "Conversation not found" });
      }

      res.send({ success: true });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Send message in a conversation
  app.post("/api/admin/chat/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).send({ error: "Content is required" });
      }

      const user = req.user as any;
      const message = await chatService.adminSendMessage(conversationId, content, user.id);
      res.send(message);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Mark messages as read
  app.patch("/api/admin/chat/conversations/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await chatService.markMessagesAsRead(id);
      res.send({ success: true });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // ============================================================
  // QUICK RESPONSES ROUTES
  // ============================================================

  // Admin: Get all quick responses
  app.get("/api/admin/chat/quick-responses", requireAuth, async (_req, res) => {
    try {
      const data = await chatService.getAllQuickResponses();
      res.send(data);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Create quick response
  app.post("/api/admin/chat/quick-responses", requireAuth, async (req, res) => {
    try {
      const result = insertQuickResponseSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const response = await chatService.createQuickResponse(result.data);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Update quick response
  app.patch("/api/admin/chat/quick-responses/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertQuickResponseSchema.partial().safeParse(req.body);

      if (!result.success) {
        return res.status(400).send({ error: fromZodError(result.error).message });
      }

      const response = await chatService.updateQuickResponse(id, result.data);

      if (!response) {
        return res.status(404).send({ error: "Quick response not found" });
      }

      res.send(response);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Delete quick response
  app.delete("/api/admin/chat/quick-responses/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await chatService.deleteQuickResponse(id);

      if (!success) {
        return res.status(404).send({ error: "Quick response not found" });
      }

      res.send({ success: true });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // ============================================================
  // LINE SETTINGS ROUTES
  // ============================================================

  // Admin: Get LINE settings
  app.get("/api/admin/line/settings", requireAuth, async (_req, res) => {
    try {
      const settings = await chatService.getLineSettings();
      res.send(settings || {});
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Update LINE settings
  app.patch("/api/admin/line/settings", requireAuth, async (req, res) => {
    try {
      const settings = await chatService.updateLineSettings(req.body);
      res.send(settings);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // Admin: Test LINE connection
  app.post("/api/admin/line/test", requireAuth, async (_req, res) => {
    try {
      const result = await lineService.testLineConnection();
      res.send(result);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

  // ============================================================
  // LINE WEBHOOK ENDPOINT
  // ============================================================

  // LINE Webhook - receives messages from LINE platform
  // This endpoint must be publicly accessible and does not require auth
  app.post("/api/webhook/line", async (req, res) => {
    try {
      // Get channel secret from database settings
      const settings = await lineService.getLineSettings();
      if (!settings?.channelSecret || !settings.isActive) {
        console.warn("LINE webhook called but LINE is not configured or inactive");
        return res.status(200).send("OK"); // Always return 200 to LINE
      }

      // Verify signature
      const signature = req.headers["x-line-signature"] as string;
      const body = JSON.stringify(req.body);

      if (!signature || !lineService.verifySignature(body, signature, settings.channelSecret)) {
        console.error("LINE webhook signature verification failed");
        return res.status(403).send("Invalid signature");
      }

      // Handle events
      const events = req.body.events || [];
      await lineService.handleLineWebhook(events, settings.channelSecret);

      res.status(200).send("OK");
    } catch (error: any) {
      console.error("LINE webhook error:", error);
      // Always return 200 to LINE even on error to prevent retries
      res.status(200).send("OK");
    }
  });

  return httpServer;
}
