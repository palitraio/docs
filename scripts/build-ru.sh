#!/usr/bin/env bash
# Build the Russian site (docs.ru.palitra.io, synced to s3://palitra-ru/docs/) into ./dist.
set -euo pipefail

cd "$(dirname "$0")/.."

node scripts/check-content.mjs
SITE_LOCALE=ru pnpm exec astro build
./scripts/check-site.sh ru

echo "OK: dist/ ready (ru)"
