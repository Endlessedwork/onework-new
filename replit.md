# Onework - Hotel Supplies E-commerce Platform

## Overview

Onework is a bilingual (English/Thai) e-commerce website for premium hotel amenities and design products. The platform serves as a product showcase and contact portal for hotel supply businesses, featuring product collections, company information, and an admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for language/auth
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API endpoints under `/api/*`
- **Build**: esbuild for production bundling with selective dependency bundling

### Authentication System
- **Strategy**: Session-based authentication using Passport.js with Local Strategy
- **Session Storage**: MemoryStore (development) with express-session
- **Password Hashing**: Node.js crypto module (scrypt with random salt)
- **Protected Routes**: Admin routes require authentication middleware

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Tables**: 
  - `users` - Admin authentication
  - `products` - Product catalog with bilingual fields (EN/TH)
  - `settings` - Key-value store for site configuration

### Internationalization
- **Approach**: Custom i18n implementation using React Context
- **Languages**: English (en) and Thai (th)
- **Translation Keys**: Stored in client-side translation objects
- **Bilingual Content**: Database fields include separate EN/TH columns for products

### Key Design Patterns
- **Monorepo Structure**: Client (`client/`), Server (`server/`), Shared (`shared/`)
- **Path Aliases**: `@/` for client, `@shared/` for shared code
- **Type Safety**: Zod schemas for validation, Drizzle-Zod for database types
- **API Client**: Centralized fetch wrapper with React Query integration

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Connection**: `pg` Pool with Drizzle ORM wrapper

### UI Component Library
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Headless UI primitives for dialogs, dropdowns, tabs, etc.
- **Lucide Icons**: Icon library for UI elements

### Development Tools
- **Replit Plugins**: Cartographer, Dev Banner, Runtime Error Modal
- **Vite Plugins**: React, Tailwind CSS, custom meta-images plugin

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `SESSION_SECRET` - Session encryption key (optional, has default for development)