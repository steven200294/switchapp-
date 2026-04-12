#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app/backend
npx prisma migrate deploy --schema=prisma/schema.prisma
echo "Migrations applied."

echo "Starting API server..."
exec node dist/bootstrap/server.js
