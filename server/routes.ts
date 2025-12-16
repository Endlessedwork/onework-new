import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, hashPassword } from "./auth";
import passport from "passport";
import { insertProductSchema, insertSettingSchema, insertUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
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

  return httpServer;
}
