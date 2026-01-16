# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build && rm -f dist/public/favicon.png

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install production dependencies + drizzle-kit and tsx for migrations/seed
RUN npm ci --omit=dev && npm install drizzle-kit tsx && npm cache clean --force

# Remove build tools after installing
RUN apk del python3 make g++

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy drizzle config and schema for migrations
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/shared ./shared

# Copy all scripts (start.sh, seed-production.ts, seed-data.json)
COPY --from=builder /app/scripts ./scripts
RUN chmod +x scripts/start.sh

# Create uploads directory
RUN mkdir -p uploads && chown -R node:node uploads

# Use non-root user
USER node

# Expose port
EXPOSE 3000

# Health check - give more time for migrations
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start with migration script
CMD ["sh", "scripts/start.sh"]
