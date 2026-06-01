# ADR-0005: Preserve "use client" directives in the published bundle

- **Status:** Accepted
- **Date:** 2026-06
- **Deciders:** core maintainers
- **Tags:** bundling, rsc, tooling

## Context and Problem Statement

The library is bundled with tsup (esbuild). esbuild **strips module-level
`"use client"` directives when bundling** — verified on the v1.8 output: a
`grep -r "use client" dist/` returned nothing. For consumers on the Next.js App
Router (React Server Components), this is a latent break: importing an
interactive component (hooks, event handlers) from a Server Component requires
the package to carry a client boundary, and without the directive the import
errors at build/runtime. The shipped bundle had **no** directives anywhere.

How do we get a correct `"use client"` boundary into `dist/` without changing
the bundling model or forcing the server-safe `icons` entry to the client?

## Decision Drivers

- RSC correctness: client entries must carry a `"use client"` boundary.
- Keep `./icons` (pure icon-content data) usable from Server Components.
- Don't fight tsup's pipeline or fork the build tool.
- Make the result verifiable, so it can't silently regress.

## Considered Options

1. **`esbuild-plugin-preserve-directives`** in `tsup.esbuildPlugins` — re-hoists
   directives per output chunk.
2. **tsup `banner`** injecting `"use client"` per format — global to a build.
3. **Post-build stamping** — prepend `"use client"` to the client entry files
   after a successful build (tsup `onSuccess`), guarded by a check script.

## Decision Outcome

Chosen option: **"Post-build stamping"** (option 3).

Option 1 does not survive tsup's pipeline: the plugin injects the directive, but
tsup re-processes the output through esbuild, which strips it again (emitting
`"... 'use client' ... was ignored"` warnings) — the final `dist/` ended up with
no directives. Option 2 is global to a format, so it would also stamp the
server-safe `icons` entry and its chunks, violating a driver.

A directive at the top of an **entry** makes that entry's entire imported graph
a client boundary in RSC, so the shared chunks do **not** each need one. We
therefore stamp only the client entries:

- `scripts/add-use-client.mjs` (tsup `onSuccess`) prepends `'use client';` to
  `dist/index.{js,cjs}`, `dist/3d/index.{js,cjs}`, `dist/charts/index.{js,cjs}`.
  It is idempotent (safe under watch) and leaves `dist/icons/index.js` untouched.
- `scripts/check-directives.mjs` (`pnpm check:directives`, wired into the gate
  and `ci.yml`) asserts the client entries start with the directive and that the
  `icons` entry does not — a regression guard if the stamping is ever removed.

### Consequences

- **Good** — RSC consumers get a correct client boundary; `./icons` stays
  server-safe; no change to the bundling model or chunking.
- **Good** — the outcome is verified in CI, so it cannot silently regress.
- **Bad** — the whole main entry is a client boundary, so a Server Component
  importing a genuinely server-safe symbol from the root barrel still crosses to
  the client. Acceptable: the library is overwhelmingly interactive, and
  server-safe data (icons) has its own entry.
- **Bad** — directive placement lives in a script tied to the entry list; adding
  a new client entry means updating both scripts (the check makes a miss loud).

## More Information

- `tsup.config.ts` (`onSuccess`), `scripts/add-use-client.mjs`,
  `scripts/check-directives.mjs`.
- Related: [ADR-0003](./0003-optional-peer-dependencies-pattern.md) (the four
  places an optional peer is declared — the same "wire it everywhere and verify"
  discipline).
