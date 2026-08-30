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

capture() {
  local viewport="$1"
  local url="$2"
  local target="$3"
  npx --yes playwright@1.55.0 screenshot \
    --browser chromium \
    --viewport-size "$viewport" \
    --full-page \
    "$url" "$target"
}

# A superfície pública continua vazia enquanto publishedArticles estiver vazio.
capture "1280,900" "$BASE/" "$OUT/home-desktop.png"
capture "390,844" "$BASE/" "$OUT/home-mobile.png"

# O estado populado só existe em localhost; o mesmo renderer recebe fixtures de composição.
capture "1280,900" "$BASE/?preview=populated" "$OUT/home-populated-preview-desktop.png"
capture "390,844" "$BASE/?preview=populated" "$OUT/home-populated-preview-mobile.png"

# A rota de matéria é capturada pelo mesmo método antes/depois. Antes da implementação,
# o servidor devolve a página 404; depois, o preview local exercita o template real.
capture "1280,900" "$BASE/article.html?preview=article" "$OUT/article-preview-desktop.png"
capture "390,844" "$BASE/article.html?preview=article" "$OUT/article-preview-mobile.png"

printf 'Captured:\n- %s\n- %s\n- %s\n- %s\n- %s\n- %s\n' \
  "$OUT/home-desktop.png" \
  "$OUT/home-mobile.png" \
  "$OUT/home-populated-preview-desktop.png" \
  "$OUT/home-populated-preview-mobile.png" \
  "$OUT/article-preview-desktop.png" \
  "$OUT/article-preview-mobile.png"
