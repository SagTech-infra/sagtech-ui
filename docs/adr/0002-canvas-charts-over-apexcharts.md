# ADR-0002: Canvas charts over ApexCharts

- **Status:** Accepted
- **Date:** 2026-05 <!-- retrospective -->
- **Deciders:** core maintainers
- **Tags:** charts, bundling, theming, testing

> **Retrospective.** This ADR records a decision already shipped across v1.x. It
> is written down now to preserve the rationale before the v2.0 cleanup.

## Context and Problem Statement

The library ships 12 chart components (`AreaChart`, `BarChart`, `DonutChart`,
`FunnelChart`, `GaugeChart`, `HeatmapChart`, `LineChart`, `RadarChart`,
`SankeyChart`, `ScatterChart`, `SparklineChart`, `TreemapChart`), exported via
the `./charts` subpath. We needed a rendering strategy that stayed inside our
bundle-size budgets, themed cleanly off our CSS custom properties, and did not
force a heavy charting dependency onto consumers. During the v1.7 dependency
sweep, `apexcharts` / `react-apexcharts` were removed from devDependencies —
confirming the charts owe nothing to ApexCharts.

## Decision Drivers

- **Bundle size** — the `check:size` budgets (`.size-limit.json`) cap the
  `./charts` entry tightly; a heavy charting lib would blow them.
- **Theming control** — charts must read our CSS custom properties
  (via `useThemeColors`) so they track the active theme, not a library's own
  theming model.
- **No heavy peer** — we did not want to push a large optional peer onto every
  consumer who imports a single sparkline.

## Considered Options

1. **ApexCharts wrapper** — thin React wrappers around `react-apexcharts`.
2. **Recharts** — a React-native SVG charting library.
3. **Raw canvas / SVG, hand-rolled** — draw each chart ourselves and read
   theme colors via `useThemeColors`.

## Decision Outcome

Chosen option: **"Raw canvas / SVG, hand-rolled + `useThemeColors`"**, because
it gives full control over rendering and theming at a fraction of the bundle
cost, with no third-party charting peer for consumers to install. ApexCharts and
Recharts both impose a sizeable bundle and their own theming abstractions we'd
have to fight to match our token system.

### Consequences

- **Good** — Full control over geometry, animation, and theming; charts read
  resolved token values via `useThemeColors` and track the active theme.
- **Good** — Tiny `./charts` bundle, comfortably inside the `check:size` budget;
  no charting peer dependency forced on consumers.
- **Bad** — More hand-written maintenance: every chart type is bespoke code we
  own end to end, including layout math and edge cases a library would handle.
- **Bad** — Canvas geometry is physically LTR and is **not exercisable in
  happy-dom** (no real 2D context), so charts are **smoke-tested only** — we
  assert that they mount/render without throwing rather than verifying pixels.
  This ties directly into the project test strategy: logical/DOM assertions in
  Vitest + happy-dom, visual correctness deferred to Storybook review.

## More Information

- `.size-limit.json` — the `./charts` entry budget this decision protects.
- `src/hooks/useThemeColors.ts` — runtime theme color accessor the charts use.
- [ADR-0001](./0001-dark-first-design-tokens.md) — dark-first tokens and the
  partial theme-awareness of canvas surfaces.
