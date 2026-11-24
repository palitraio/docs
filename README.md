# Palitra docs

Customer documentation for [Palitra](https://palitra.io), built with
[Starlight](https://starlight.astro.build). One site per locale, no `/en` or `/ru` prefixes: English
at https://docs.palitra.io (Vercel), Russian at https://docs.ru.palitra.io (bucket).
`SITE_LOCALE=en|ru` selects the build (default `en`); sources are `src/content/docs/en/` and
`src/content/docs/ru/`.

Content rules for authors and agents: [CLAUDE.md](CLAUDE.md).

## Run

Requires Node 22 and pnpm.

```sh
pnpm install
pnpm dev            # http://localhost:4321
pnpm test           # content checker tests
pnpm lint           # oxlint
pnpm typecheck      # astro check (TypeScript 6; astro check does not support 7)
pnpm format:check   # oxfmt
```

## Build

```sh
pnpm build                  # both locales in turn; dist/ ends up holding the Russian build
./scripts/build-en.sh       # check-content, astro build, check-site.sh en -> dist/ (Vercel)
./scripts/build-ru.sh       # same for ru -> dist/ (sync to s3://palitra-ru/docs/)
pnpm preview
```

`scripts/check-site.sh <locale>` checks a built `dist/`: 404 page present, no `en/` or `ru/`
directories or prefixed links, cross-domain links only in hreflang alternates and the
language switch, a single-language Pagefind index, `<html lang>` on every page.

`pnpm check:content` fails when a Russian article has no English twin (or the reverse), or
when `editions` / `sources` frontmatter is missing or invalid.

## Publish

Merging to `main` publishes both sites:

- Russian, docs.ru.palitra.io: `.github/workflows/deploy-ru.yml` runs on push to `main`, builds
  with `./scripts/build-ru.sh` and syncs `dist/` to the `palitra-ru` bucket under `docs/` on
  cloud.ru Object Storage.
- English, docs.palitra.io: Vercel's git integration builds `./scripts/build-en.sh` (see
  `vercel.json`) and serves `dist/`.

Pull requests run `.github/workflows/ci.yml` (tests, typecheck, both builds).
