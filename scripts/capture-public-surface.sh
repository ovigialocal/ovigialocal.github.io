#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_ROOT="${1:-$ROOT}"
OUT="${2:-$ROOT/artifacts/visual}"
PORT="${PORT:-4173}"
BASE="http://127.0.0.1:${PORT}"

mkdir -p "$OUT"

python3 -m http.server "$PORT" --directory "$SITE_ROOT" >"$OUT/http-server.log" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

for _ in $(seq 1 30); do
  if curl --fail --silent "$BASE/" >/dev/null; then break; fi
  sleep 0.2
done
curl --fail --silent "$BASE/" >/dev/null

capture() {
  local viewport="$1" url="$2" target="$3"
  npx --yes playwright@1.55.0 screenshot --browser chromium --viewport-size "$viewport" --full-page "$url" "$target"
}

capture_pair() {
  local route="$1" name="$2"
  capture "1280,900" "$BASE$route" "$OUT/${name}-desktop.png"
  capture "390,844" "$BASE$route" "$OUT/${name}-mobile.png"
}

capture_pair "/" "home"

ARTICLE_DIR="$(find "$SITE_ROOT/noticias" -mindepth 1 -maxdepth 1 -type d | sort | head -n 1 || true)"
if [[ -z "$ARTICLE_DIR" ]]; then
  echo "No rendered article found under $SITE_ROOT/noticias" >&2
  exit 1
fi
ARTICLE_SLUG="$(basename "$ARTICLE_DIR")"
capture_pair "/noticias/$ARTICLE_SLUG/" "article"
capture_pair "/metodologia.html" "methodology"
capture_pair "/correcoes.html" "corrections"
capture_pair "/editorias.html" "sections"
capture_pair "/arquivo.html" "archive"

printf 'Captured 12 public-surface views in %s\n' "$OUT"
