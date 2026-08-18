#!/bin/sh
set -e

# Default to a SQLite file on the mounted persistent volume when the caller
# hasn't overridden DATABASE_URL (e.g. to point at Postgres/MySQL instead).
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="file:/app/data/prod.db"
fi

echo "Syncing database schema ($DATABASE_URL)..."
npx prisma db push --skip-generate

if [ "$SEED_DEMO_DATA" = "true" ]; then
  echo "Seeding demo data..."
  npx tsx prisma/seed.ts
fi

exec "$@"
