#!/bin/sh
echo "Running database migrations..."
npx drizzle-kit push --force || echo "Drizzle push failed, trying SQL migration..."

# Run SQL migration as fallback for chat tables
echo "Running chat tables migration..."
if [ -f "scripts/run-migration.ts" ]; then
  npx tsx scripts/run-migration.ts
fi

echo "Running database seed..."
npx tsx scripts/seed-production.ts
echo "Starting application..."
node dist/index.cjs
