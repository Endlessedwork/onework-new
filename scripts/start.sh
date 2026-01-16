#!/bin/sh
echo "Running database migrations..."
npx drizzle-kit push --force
echo "Running database seed..."
npx tsx scripts/seed-production.ts
echo "Starting application..."
node dist/index.cjs
