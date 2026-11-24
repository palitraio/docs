# Palitra docs

Customer documentation for [Palitra](https://palitra.io), built with
[Starlight](https://starlight.astro.build). Russian is the root locale, English lives under
`/en`. Published at https://docs.palitra.io.

Content rules for authors and agents: [CLAUDE.md](CLAUDE.md).

## Run

Requires Node 22 and pnpm.

```sh
pnpm install
pnpm dev            # http://localhost:4321
pnpm test           # content checker tests
pnpm lint           # oxlint
pnpm format:check   # oxfmt
```

## Build

```sh
pnpm build          # check-content, then astro build into dist/ (with Pagefind search index)
pnpm preview
```

`pnpm check:content` fails when a Russian article has no English twin (or the reverse), or
when `editions` / `sources` frontmatter is missing or invalid.

## Publish

Merging to `main` publishes the site. The publish workflows are added separately.
