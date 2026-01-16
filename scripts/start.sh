#!/bin/sh
echo "Running database migrations..."
npx drizzle-kit push --force || echo "Drizzle push failed, trying SQL migration..."

# Run SQL migration as fallback for chat tables
echo "Running chat tables migration..."
if [ -f "scripts/migrate-chat.sql" ]; then
  PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') \
  psql "$DATABASE_URL" -f scripts/migrate-chat.sql 2>/dev/null || \
  npx tsx scripts/run-migration.ts || \
  echo "SQL migration skipped (psql not available)"
fi

echo "Running database seed..."
npx tsx scripts/seed-production.ts
echo "Starting application..."
node dist/index.cjs
