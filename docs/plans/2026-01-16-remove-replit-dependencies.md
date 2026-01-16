# Remove Replit Dependencies Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** ลบ Replit-specific code ทั้งหมดเพื่อให้โปรเจกต์รันได้บน local machine โดยไม่ต้องพึ่ง Replit services

**Architecture:** เปลี่ยน Replit Object Storage เป็น Local File Storage และลบ Vite plugins ที่ใช้เฉพาะบน Replit

**Tech Stack:** Express + multer (file upload), Vite (ไม่มี Replit plugins)

---

## Task 1: แก้ไข vite.config.ts - ลบ Replit plugins

**Files:**
- Modify: `vite.config.ts`

**Step 1: ลบ import และ plugins ที่เกี่ยวกับ Replit**

แก้ไข `vite.config.ts` เป็น:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

**Step 2: Verify syntax**

Run: `npx tsc --noEmit vite.config.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: remove Replit vite plugins"
```

---

## Task 2: ลบ vite-plugin-meta-images.ts

**Files:**
- Delete: `vite-plugin-meta-images.ts`

**Step 1: ลบไฟล์**

```bash
rm vite-plugin-meta-images.ts
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove Replit meta-images plugin"
```

---

## Task 3: แก้ไข package.json - ลบ @replit dependencies

**Files:**
- Modify: `package.json`

**Step 1: ลบ @replit dependencies และเพิ่ม multer**

ลบ 3 บรรทัดนี้จาก devDependencies:
```json
"@replit/vite-plugin-cartographer": "^0.4.4",
"@replit/vite-plugin-dev-banner": "^0.1.1",
"@replit/vite-plugin-runtime-error-modal": "^0.0.4",
```

เพิ่มใน dependencies:
```json
"multer": "^1.4.5-lts.1",
```

เพิ่มใน devDependencies:
```json
"@types/multer": "^1.4.12",
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "chore: remove @replit deps, add multer for local upload"
```

---

## Task 4: สร้าง Local File Storage Service

**Files:**
- Create: `server/localStorage.ts`
- Delete: `server/objectStorage.ts`

**Step 1: สร้างไฟล์ localStorage.ts**

```typescript
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
```

**Step 2: ลบ objectStorage.ts**

```bash
rm server/objectStorage.ts
```

**Step 3: Commit**

```bash
git add server/localStorage.ts
git add -A
git commit -m "feat: replace Replit object storage with local file storage"
```

---

## Task 5: อัปเดต routes.ts สำหรับ Local Storage

**Files:**
- Modify: `server/routes.ts`

**Step 1: อัปเดต imports และ upload routes**

เปลี่ยน import จาก:
```typescript
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
```

เป็น:
```typescript
import { LocalStorageService, ObjectNotFoundError } from "./localStorage";
import multer from "multer";
import path from "path";
```

**Step 2: เพิ่ม multer config หลัง imports**

```typescript
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const localStorageService = new LocalStorageService();
    cb(null, localStorageService.generateFilename(file.originalname));
  },
});

const upload = multer({
  storage,
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
```

**Step 3: เปลี่ยน upload route (around line 286-296)**

จาก:
```typescript
app.post("/api/admin/upload", requireAuth, async (_req, res) => {
  try {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  } catch (error: any) {
    console.error("Upload URL error:", error);
    res.status(500).send({ error: error.message });
  }
});
```

เป็น:
```typescript
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
```

**Step 4: เปลี่ยน serve objects route (around line 299-311)**

จาก:
```typescript
app.get("/objects/:objectPath(*)", async (req, res) => {
  const objectStorageService = new ObjectStorageService();
  try {
    const objectFile = await objectStorageService.getObjectEntityFile(req.path);
    objectStorageService.downloadObject(objectFile, res);
  } catch (error) {
    console.error("Error serving object:", error);
    if (error instanceof ObjectNotFoundError) {
      return res.sendStatus(404);
    }
    return res.sendStatus(500);
  }
});
```

เป็น:
```typescript
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
```

**Step 5: Commit**

```bash
git add server/routes.ts
git commit -m "feat: update routes for local file upload"
```

---

## Task 6: อัปเดต ObjectUploader component

**Files:**
- Modify: `client/src/components/ObjectUploader.tsx`

**Step 1: อ่านไฟล์เดิมและแก้ไขให้ใช้ direct upload**

แก้ไข component ให้ upload ไฟล์โดยตรงแทนที่จะขอ signed URL:

```typescript
// Local File Uploader Component
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";

interface ObjectUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export function ObjectUploader({ onUploadComplete, currentImage, className }: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only image files are allowed (JPEG, PNG, GIF, WebP, SVG)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadComplete("");
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-dashed"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8" />
              <span>Click to upload image</span>
            </div>
          )}
        </Button>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add client/src/components/ObjectUploader.tsx
git commit -m "feat: update ObjectUploader for local file storage"
```

---

## Task 7: อัปเดต client/index.html

**Files:**
- Modify: `client/index.html`

**Step 1: เปลี่ยน twitter:site จาก @replit**

เปลี่ยน:
```html
<meta name="twitter:site" content="@replit" />
```

เป็น:
```html
<meta name="twitter:site" content="@onework" />
```

**Step 2: Commit**

```bash
git add client/index.html
git commit -m "chore: update twitter meta tag"
```

---

## Task 8: ลบ replit_integrations และ replit.md

**Files:**
- Delete: `client/replit_integrations/` (directory)
- Delete: `server/replit_integrations/` (directory)
- Delete: `replit.md`

**Step 1: ลบไฟล์และโฟลเดอร์**

```bash
rm -rf client/replit_integrations
rm -rf server/replit_integrations
rm -f replit.md
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove Replit integration files"
```

---

## Task 9: สร้าง uploads directory และ .gitkeep

**Files:**
- Create: `uploads/.gitkeep`
- Modify: `.gitignore`

**Step 1: สร้าง uploads directory**

```bash
mkdir -p uploads
touch uploads/.gitkeep
```

**Step 2: เพิ่มใน .gitignore**

เพิ่มบรรทัดนี้:
```
# Uploads (keep directory, ignore files)
uploads/*
!uploads/.gitkeep
```

**Step 3: Commit**

```bash
git add uploads/.gitkeep .gitignore
git commit -m "chore: add uploads directory for local storage"
```

---

## Task 10: Reinstall dependencies และทดสอบ

**Step 1: ลบ node_modules และ reinstall**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Step 2: ทดสอบ build**

```bash
npm run check
npm run build
```

Expected: No TypeScript errors, build successful

**Step 3: ทดสอบ dev server**

```bash
npm run dev
```

Expected: Server starts on port 5000

**Step 4: Final commit**

```bash
git add package-lock.json
git commit -m "chore: update lockfile after removing Replit deps"
```

---

## Summary

หลังจากทำตามแผนนี้เสร็จ:

1. ✅ ไม่มี Replit dependencies ใน package.json
2. ✅ ไม่มี Replit plugins ใน vite.config.ts
3. ✅ Upload รูปภาพใช้ local file storage แทน Replit Object Storage
4. ✅ ลบ replit_integrations folders
5. ✅ โปรเจกต์รันได้บน local machine

**Environment Variables ที่ต้องมี:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - (optional) session encryption key
- `OPENAI_API_KEY` - (optional) for chatbot feature
