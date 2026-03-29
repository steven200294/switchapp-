#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/switchapp_${TIMESTAMP}.sql"

mkdir -p "$BACKUP_DIR"

CONTAINER=$(docker ps --format '{{.Names}}' | grep postgres | head -1)
if [ -z "$CONTAINER" ]; then
  echo "Error: No running postgres container found"
  exit 1
fi

echo "Backing up from container: $CONTAINER"
docker exec "$CONTAINER" pg_dump -U "${POSTGRES_USER:-switchapp}" \
  --no-owner --no-acl \
  --schema=public --schema=auth \
  "${POSTGRES_DB:-switchapp}" > "$BACKUP_FILE"

echo "Backup saved to: $BACKUP_FILE ($(wc -l < "$BACKUP_FILE") lines)"
echo ""
echo "To restore on Railway:"
echo "  psql \$RAILWAY_DATABASE_URL < $BACKUP_FILE"
