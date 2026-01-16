import fs from "fs";
import path from "path";
import { Response } from "express";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class ObjectNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ObjectNotFoundError";
  }
}

export class LocalStorageService {
  /**
   * Generate a unique filename
   */
  generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const uniqueId = crypto.randomBytes(16).toString("hex");
    return `${uniqueId}${ext}`;
  }

  /**
   * Get the full path for a file
   */
  getFilePath(filename: string): string {
    return path.join(UPLOAD_DIR, filename);
  }

  /**
   * Check if file exists
   */
  async fileExists(filename: string): Promise<boolean> {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  /**
   * Get file and stream to response
   */
  async downloadFile(filename: string, res: Response): Promise<void> {
    const filePath = this.getFilePath(filename);

    if (!fs.existsSync(filePath)) {
      throw new ObjectNotFoundError(`File not found: ${filename}`);
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    // Set content type based on extension
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
    };

    res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Cache-Control", "public, max-age=31536000");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }

  /**
   * Delete a file
   */
  async deleteFile(filename: string): Promise<boolean> {
    const filePath = this.getFilePath(filename);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    fs.unlinkSync(filePath);
    return true;
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}

export const localStorageService = new LocalStorageService();
