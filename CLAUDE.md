# CLAUDE.md

Rules for agents writing or editing customer documentation in this repository. The site is
public, built with Astro Starlight, in Russian (root locale) and English (`en/`).

## Where facts come from

- Write only from code: frontend routes and components in `palitra-frontend`,
  `*.{ru,en}.messages.json` for interface labels, backend connectors in `palitra-backend` for
  behaviour.
- Never use the landing page `integrations` or `features` content, or the internal docs
  specs, as evidence. They describe intent, not what the product does.
- Every article lists the code it was written from in `sources:` (workspace-relative paths,
  at least one).
- Use the terms from `docs-internal/01-ubiquitous-language.md` in their customer-facing form
  for each locale.

## Article layout

- Russian article: `src/content/docs/<path>.md(x)`. English twin: `src/content/docs/en/<path>.md(x)`.
  `.md` and `.mdx` count as the same stem. Both must exist.
- Frontmatter: `title`, `description`, `editions` (non-empty subset of `saas`, `byoc`),
  `sources` (non-empty list).
- `pnpm check:content` validates twins and frontmatter; `pnpm build` runs it first.

## Stability

- Slugs and heading anchors are stable: others link to them. When one must change, add a
  redirect from the old URL.

## Process

- Every change is a pull request that the owner reviews. No secrets or internal hostnames
  in content: the repository is public.
