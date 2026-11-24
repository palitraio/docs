#!/usr/bin/env bash
# Checks a built dist/ for one locale: ./scripts/check-site.sh ru|en
set -euo pipefail

cd "$(dirname "$0")/.."

locale="${1:-}"
case "$locale" in
ru)
  other_domain="https://docs.palitra.io"
  own_origin="https://docs.ru.palitra.io"
  ;;
en)
  other_domain="https://docs.ru.palitra.io"
  own_origin="https://docs.palitra.io"
  ;;
*)
  echo "usage: check-site.sh ru|en" >&2
  exit 2
  ;;
esac

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

[ -d dist ] || fail "dist/ does not exist; build first"
[ -f dist/404.html ] || fail "dist/404.html missing; the error document needs it"
[ ! -d dist/en ] || fail "dist/en exists; locale prefixes are not used"
[ ! -d dist/ru ] || fail "dist/ru exists; locale prefixes are not used"

if grep -rqE 'href="/(en|ru)/' dist --include='*.html'; then
  fail "a locale-prefixed link survived the build"
fi

# Astro minifies each page to one line, so count occurrences rather than filter lines. Each
# link to the other domain must sit in an hreflang alternate or in the language switch.
while IFS= read -r page; do
  total=$(grep -o "$other_domain" "$page" | wc -l | tr -d ' ' || true)
  alternates=$(grep -oE '<link rel="alternate"[^>]*>' "$page" | grep -o "$other_domain" | wc -l | tr -d ' ' || true)
  switches=$(grep -oE '<a [^>]*data-language-switch[^>]*>' "$page" | grep -o "$other_domain" | wc -l | tr -d ' ' || true)
  if [ "$total" -ne $((alternates + switches)) ]; then
    fail "$page links to $other_domain outside hreflang and the language switch"
  fi
done < <(find dist -name '*.html')

[ -f dist/favicon.svg ] || fail "dist/favicon.svg missing"
[ -f dist/robots.txt ] || fail "dist/robots.txt missing"
grep -qx 'User-agent: \*' dist/robots.txt || fail "robots.txt lacks 'User-agent: *'"
grep -qx 'Allow: /' dist/robots.txt || fail "robots.txt lacks 'Allow: /'"
grep -qx "Sitemap: ${own_origin}/sitemap-index.xml" dist/robots.txt ||
  fail "robots.txt Sitemap line is not ${own_origin}/sitemap-index.xml"

pagefind_languages=$(node -e '
const entry = JSON.parse(require("node:fs").readFileSync("dist/pagefind/pagefind-entry.json", "utf8"));
console.log(Object.keys(entry.languages).sort().join(","));
')
[ "$pagefind_languages" = "$locale" ] ||
  fail "Pagefind index languages are '${pagefind_languages}', expected '${locale}'"
ls dist/pagefind/fragment/*.pf_fragment >/dev/null 2>&1 || fail "no Pagefind fragments in dist/pagefind"

while IFS= read -r page; do
  grep -q "<html lang=\"${locale}\"" "$page" || fail "$page lacks <html lang=\"${locale}\">"
done < <(find dist -name '*.html' -not -path 'dist/pagefind/*')

echo "OK: dist/ checks passed ($locale)"
