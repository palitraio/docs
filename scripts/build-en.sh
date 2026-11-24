#!/usr/bin/env bash
# Build the English site (docs.palitra.io, deployed by Vercel) into ./dist.
set -euo pipefail

cd "$(dirname "$0")/.."

node scripts/check-content.mjs
SITE_LOCALE=en pnpm exec astro build
./scripts/check-site.sh en

echo "OK: dist/ ready (en)"
