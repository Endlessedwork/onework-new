# OneWork - Hotel Supplies E-commerce Platform

## Project Overview

E-commerce website สำหรับ hotel amenities และ design products รองรับ 2 ภาษา (English/Thai) ประกอบด้วย product showcase, company information และ admin dashboard สำหรับจัดการ content

## Quick Start

```bash
# Development
npm run dev          # Start server (port 5000)
npm run dev:client   # Start Vite dev server only

# Production
npm run build        # Build for production
npm run start        # Run production build

# Database
npm run db:push      # Push schema changes to DB

# Type checking
npm run check        # Run TypeScript check
```

## Tech Stack

### Frontend
- **React 19** + TypeScript
- **Wouter** - Lightweight router
- **TanStack Query** - Server state management
- **Tailwind CSS v4** + shadcn/ui (New York style)
- **Framer Motion** - Animations
- **Vite 7** - Build tool

### Backend
- **Express** + TypeScript (ESM modules)
- **PostgreSQL** + Drizzle ORM
- **Passport.js** - Session-based auth
- **OpenAI** - Chatbot integration

## Project Structure

```
├── client/               # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities (i18n, api, utils)
│   └── public/           # Static assets
├── server/               # Backend Express app
│   ├── routes.ts         # API endpoints
│   ├── auth.ts           # Authentication
│   ├── storage.ts        # Data access layer
│   └── db.ts             # Database connection
├── shared/               # Shared code
│   └── schema.ts         # Drizzle schema + Zod types
└── attached_assets/      # Project assets
```

## Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | Admin authentication |
| `products` | Product catalog (bilingual EN/TH) |
| `categories` | Product categories |
| `settings` | Site configuration (key-value) |
| `chatbot_settings` | AI chatbot configuration |
| `chatbot_training_data` | Chatbot Q&A training data |

## API Endpoints

Base: `/api/*`

- `GET/POST /api/products` - Product CRUD
- `GET/POST /api/categories` - Category CRUD
- `GET/PUT /api/settings` - Site settings
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/user` - Get current user
- `POST /api/chat` - AI chatbot

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | No | Session encryption key |
| `OPENAI_API_KEY` | No | For chatbot feature |

## i18n (Internationalization)

- Custom implementation via React Context
- Languages: English (`en`), Thai (`th`)
- Translation files: `client/src/lib/i18n.ts`
- Database fields have `_en` and `_th` suffixes for bilingual content

## Important Patterns

### API Calls
```typescript
// Use the centralized fetch wrapper
import { apiRequest } from "@/lib/queryClient";
const data = await apiRequest("/api/products", "GET");
```

### Form Validation
```typescript
// Zod schemas from shared module
import { insertProductSchema } from "@shared/schema";
```

### Protected Routes
- Admin routes require authentication middleware
- Session stored in MemoryStore (dev) or connect-pg-simple (prod)

## Component Library

Using shadcn/ui with Radix UI primitives. Import from `@/components/ui/`:
- Button, Input, Select, Dialog, Toast, etc.
- Icons from `lucide-react`

## Notes

- All forms use React Hook Form + Zod validation
- Images stored via object storage (Google Cloud Storage)
- WebSocket support available for real-time features
