#!/usr/bin/env bash
# Downloads royalty-free apartment photos (Unsplash) and uploads them to MinIO bucket "properties" under mock/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# shellcheck source=/dev/null
test -f .env && set -a && source .env && set +a

USER="${MINIO_ROOT_USER:?}"
PASS="${MINIO_ROOT_PASSWORD:?}"

NAMES=( paris-a lyon-b paris-loft bordeaux-c marseille-d toulouse-e nice-f )
URLS=(
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
)

echo "Downloading ${#NAMES[@]} images…"
for i in "${!NAMES[@]}"; do
  curl -fsSL -o "$TMP/${NAMES[$i]}.jpg" "${URLS[$i]}" &
done
wait
echo "Downloads complete."

for name in "${NAMES[@]}"; do
  docker compose cp "$TMP/${name}.jpg" "minio:/tmp/${name}.jpg"
done

docker compose exec -T minio mc alias set local http://minio:9000 "$USER" "$PASS" >/dev/null
docker compose exec -T minio mc mb -p "local/properties" 2>/dev/null || true

for name in "${NAMES[@]}"; do
  docker compose exec -T minio mc cp "/tmp/${name}.jpg" "local/properties/mock/${name}.jpg"
done

docker compose exec -T minio mc anonymous set download "local/properties" 2>/dev/null || true

echo "Uploaded ${#NAMES[@]} mock images to MinIO bucket properties/mock/."
