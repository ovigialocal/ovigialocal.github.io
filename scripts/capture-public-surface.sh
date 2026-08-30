#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/artifacts/visual}"
PORT="${PORT:-4173}"
BASE="http://127.0.0.1:${PORT}"

mkdir -p "$OUT"

python3 -m http.server "$PORT" --directory "$ROOT" >"$OUT/http-server.log" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

for _ in $(seq 1 30); do
  if curl --fail --silent "$BASE/" >/dev/null; then
    break
  fi
  sleep 0.2
done
curl --fail --silent "$BASE/" >/dev/null

npx --yes playwright@1.55.0 screenshot \
  --browser chromium \
  --viewport-size "1280,900" \
  --full-page \
  "$BASE/" "$OUT/home-desktop.png"

npx --yes playwright@1.55.0 screenshot \
  --browser chromium \
  --device "iPhone 13" \
  --full-page \
  "$BASE/" "$OUT/home-mobile.png"

printf 'Captured:\n- %s\n- %s\n' "$OUT/home-desktop.png" "$OUT/home-mobile.png"
