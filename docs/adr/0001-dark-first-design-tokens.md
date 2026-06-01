# ADR-0001: Dark-first design tokens

- **Status:** Accepted
- **Date:** 2026-05 <!-- retrospective: documents a decision already in force since v1.x -->
- **Deciders:** core maintainers
- **Tags:** tokens, theming, design-system

> **Retrospective.** This ADR records a decision that was already made and
> shipped across v1.x. It is written down now to preserve the rationale before
> the v2.0 cleanup.

## Context and Problem Statement

`@sagtech-infra/ui` dresses product surfaces that are dark by design. We needed
a single, authoritative source of design truth (colors, spacing, radii, fonts,
breakpoints) that components could consume via Tailwind utility classes rather
than hardcoding hex/px values. The open question was which color mode to treat
as primary, and whether to ship light-mode equivalents from day one.

`src/tokens/theme.css` is that source of truth: it defines the palette
(`black_1..4`, `white_1..4`, `grey_1..4`, `pr_purple`, `sec_purple`, `pr_blue`,
`sec_blue`, plus `error`/`warning`/`success`), the named spacing scale
(`--spacing-24px`, …), breakpoints, fonts, radii, and shadows inside a
Tailwind v4 `@theme` block. Components reference these as utilities
(`bg-black_1`, `text-white_4`, `p-24px`, `rounded-24px`).

## Decision Drivers

- Every product surface the library targets is dark — a light theme had no
  consumer at the time.
- A **single source of token truth** keeps components consistent and refactors
  cheap.
- Tailwind v4's `@theme` block lets tokens flow into utility classes with no
  per-component plumbing.
- Authoring a full dual palette up front is real cost with no near-term payoff
  (YAGNI).

## Considered Options

1. **Dark-first tokens** — author the dark palette only; add other modes later
   if a need appears.
2. **Light-first tokens** — author the light palette as canonical (the common
   web default), darken later.
3. **Dual (light + dark) from the start** — ship both palettes and a switching
   layer immediately.

## Decision Outcome

Chosen option: **"Dark-first tokens"**, because the only surfaces we dressed
were dark, a single dark palette was the smallest correct thing to build, and
deferring light-mode work avoided speculative cost while a later semantic layer
could retrofit it without rewriting components.

That later semantic layer did arrive: a theme-aware semantic token set
(`bg-primary`, `fg-primary`, …) sits on top of the raw palette, with the light
variant activated via `[data-theme="light"]` (see
[`../THEMING.md`](../THEMING.md)), and `useThemeColors` (v1.6) lets canvas/JS
code read the resolved values at runtime.

### Consequences

- **Good** — Smallest initial palette; no dual-mode maintenance burden while
  there were no light consumers.
- **Good** — Single source of truth (`theme.css`) keeps components consistent
  and makes token changes one-line.
- **Good** — A semantic layer could be added later without touching every
  component's class list.
- **Bad** — Retrofitting a full light theme onto a dark-first base carries
  ongoing cost; semantic tokens cover the common cases but coverage is not
  exhaustive.
- **Bad** — Canvas-rendered charts remain only partially theme-aware (they read
  resolved colors via `useThemeColors` but the geometry is still effectively
  LTR / dark-leaning — see [ADR-0002](./0002-canvas-charts-over-apexcharts.md)).

## More Information

- [`../THEMING.md`](../THEMING.md) — semantic token layer and `[data-theme]`
  switching.
- `src/tokens/theme.css` — the `@theme` source of truth.
- `src/hooks/useThemeColors.ts` — runtime accessor for resolved token values.
