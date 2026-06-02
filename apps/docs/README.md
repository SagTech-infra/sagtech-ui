# SagTech UI — Docs portal

A Next.js (App Router) documentation site **built on `@sagtech-infra/ui` itself**
(dogfooding). The shell, code blocks, search, and theming are all the library's
own components.

## How it consumes the library

- `@sagtech-infra/ui` is a workspace dependency linked via `link:../..`, so it
  resolves through the package's published `exports` (its built `dist/`).
- Design tokens come live from `@sagtech-infra/ui/tokens` (the library's `src`).
- **The library must be built** (`dist/`) before the docs build:
  `pnpm --filter @sagtech-infra/ui build`.

## Develop

```bash
# from repo root
pnpm --filter @sagtech-infra/ui build   # once, so dist exists
pnpm --filter @sagtech-infra/docs dev    # http://localhost:3000
```

`predev`/`prebuild` regenerate two files (git-ignored):

- `content/props.generated.json` — prop tables, via `react-docgen-typescript` over `src`.
- `content/demos-index.ts` — lazy (ssr:false) registry of `demos/<Name>/basic.tsx`.

## Content model

- `content/registry.ts` — the 107-component catalogue (nav + search + static params).
- `content/guides.ts` — maps repo-root `docs/*.md` to guide pages.
- `demos/<Name>/basic.tsx` — a live example (default-exported `Demo`); its source is
  read at build time and shown verbatim, so preview and code never drift.
- `demos/<Name>/meta.json` — `{ "description": "…" }` shown on the component page.

## Deploy (Vercel)

Set the project **Root Directory** to `apps/docs`. `vercel.json` builds the
library then the docs:

```
installCommand: cd ../.. && pnpm install --frozen-lockfile
buildCommand:   cd ../.. && pnpm --filter @sagtech-infra/ui build && pnpm --filter @sagtech-infra/docs build
```

CI builds the site on every change to `apps/docs/**`, `src/**`, or `docs/**`
(`.github/workflows/docs.yml`) as a breakage guard.
