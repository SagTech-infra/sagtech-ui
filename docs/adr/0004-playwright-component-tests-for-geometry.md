# ADR-0004: Playwright Component Testing for geometry/pointer/ProseMirror behaviour

- **Status:** Accepted
- **Date:** 2026-06
- **Deciders:** core maintainers
- **Tags:** testing, tooling, ci

## Context and Problem Statement

The unit suite runs on Vitest + **happy-dom**, which has no layout engine and
only stubs `ResizeObserver` / `IntersectionObserver` (`vitest.setup.ts`). A small
set of components have behaviour that is *physically* unobservable there, and
each carries a `NOTE:` in its tests spelling out exactly what cannot be covered:

- **VirtualList** — scroll-driven windowing and `measureElement` remeasure (zero
  viewport ⇒ `@tanstack/react-virtual` renders a non-deterministic row set).
- **VisualGraphEditor** — node pointer-drag, `fitView`, MiniMap viewport rect
  (`@xyflow/react` renders a zero-size viewport with no real layout).
- **RichTextEditor** — image paste/drop, mention/slash suggestion popovers, and
  syntax-highlight token spans (ProseMirror view internals + `getBoundingClientRect`
  + `document.createRange`/`DOMRect.fromRect`, none reliable in happy-dom).

These gaps were accepted as debt in v1.8 and deferred to v1.9. We need a way to
cover them in a **real browser** without slowing down the everyday loop.

## Decision Drivers

- Cover the genuinely browser-only behaviour above with real geometry/pointer/PM.
- Keep the fast `pnpm test` (happy-dom) and the PR `ci.yml` gate fast — Playwright
  browser binaries are ~300MB and slow to install/run.
- Reuse the existing Storybook/Vitest styling environment so mounted components
  are styled exactly as shipped (Tailwind v4 tokens, `next/*` mocks).
- Keep the scope narrow — this is targeted gap-filling, not a second test stack
  for the whole library.

## Considered Options

1. **Playwright Component Testing (`@playwright/experimental-ct-react`)**, run
   locally via a dedicated `test:ct` script, scoped to `*.ct.tsx`.
2. **Full Playwright E2E against a built Storybook** — heavier harness, indirection
   through stories, slower authoring for what are component-level assertions.
3. **Switch the whole suite to a real-DOM runner** (e.g. Vitest browser mode) —
   migrates 639 passing happy-dom tests for the sake of a handful, and pays the
   browser cost on every run.

## Decision Outcome

Chosen option: **"Playwright Component Testing, local-only"**, because it mounts
the actual components in Chromium with the real styling environment while leaving
the fast unit loop and the PR gate untouched.

Setup:

- `playwright-ct.config.ts` matches only `**/*.ct.tsx` (Vitest owns
  `*.test.{ts,tsx}` — the two never overlap). `ctViteConfig` reuses the
  `@tailwindcss/vite` plugin, the `@` alias, and the `next/*` mocks from
  `.storybook/main.ts`; `playwright/index.ts` imports `src/tokens/index.css` and
  pins `data-theme="dark"` to match `.storybook/preview.ts`.
- Run with `pnpm test:ct` (after `pnpm exec playwright install chromium`).
- **Scope boundary:** exactly the three components above plus a focus-ring visual
  check. New `.ct.tsx` specs are warranted only for behaviour happy-dom cannot
  reach — default to a Vitest test otherwise.

### Consequences

- **Good** — the browser-only behaviour is finally covered against a real engine,
  and the `NOTE:` gaps become executable specs.
- **Good** — zero impact on `pnpm test` speed or the `ci.yml` gate; contributors
  who don't touch these components never pay the browser cost.
- **Good** — `.ct.tsx` files live under `__tests__/`, so they are already excluded
  from coverage (`src/**/__tests__/**`) and from the tsup build entries.
- **Bad** — CT is not enforced in CI, so a regression in these specs is only
  caught when someone runs `test:ct` locally (accepted; revisit a nightly/manual
  CI job if the components churn).
- **Bad** — Playwright CT is an `experimental-*` package and ships its own pinned
  Vite (6.x) distinct from the project's Vite (8.x via Storybook); a major
  Playwright bump may need re-validation of the styling reuse.

## More Information

- Runner config: `playwright-ct.config.ts`; CT entry: `playwright/index.ts`.
- Mirrors the Storybook harness: `.storybook/main.ts`, `.storybook/preview.ts`.
- Related: [ADR-0001](./0001-dark-first-design-tokens.md) (dark-only styling the
  CT entry pins), [ADR-0002](./0002-canvas-charts-over-apexcharts.md) (canvas
  charts remain smoke-only — geometry is LTR and out of CT scope).
