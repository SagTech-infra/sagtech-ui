# Architecture Decision Records (ADR)

This directory captures the **significant, hard-to-reverse decisions** behind
`@sagtech-infra/ui` — the *why* behind the code, not the *what*. Code, types,
and Storybook already document the *what*; an ADR exists so a future maintainer
(or a future Claude) can understand the trade-offs that produced a given shape
without archaeology through git history.

We keep ADRs lightweight (MADR-flavoured — see [`template.md`](./template.md)).
An ADR is worth writing when a decision:

- is expensive or painful to reverse (bundling model, token strategy, peer-dep
  contract);
- shapes the public API or the consumer's install/bundle cost;
- was chosen over a credible alternative that a reader would reasonably expect.

> These records are **not published** — `package.json#files` ships only
> `dist`, `src/tokens`, `README.md`, and `docs/AI_MIGRATION_PROMPT.md`. ADRs are
> repo-internal documentation with zero effect on the published package.

## Numbering convention

- Filenames follow `NNNN-kebab-title.md`, where `NNNN` is a **zero-padded,
  monotonically increasing** integer (`0001`, `0002`, …).
- Numbers are never reused, even if an ADR is later deprecated or superseded —
  the index is an append-only ledger.
- The title is a short kebab-case slug describing the decision
  (`0002-canvas-charts-over-apexcharts.md`).

## Status lifecycle

```
Proposed ──▶ Accepted ──▶ Deprecated
                │
                └────────▶ Superseded by ADR-XXXX
```

| Status | Meaning |
|---|---|
| **Proposed** | Under discussion; decision not yet ratified. |
| **Accepted** | The decision is in force and reflected in the codebase. |
| **Deprecated** | No longer recommended, but not yet replaced by a specific successor. |
| **Superseded by ADR-XXXX** | Replaced by a newer ADR; link the successor explicitly. |

When a decision changes, **do not edit the old ADR's outcome** — flip its status
to `Deprecated` or `Superseded by ADR-XXXX` and write a new ADR describing the
new decision.

## Index

| № | Title | Status | Date |
|---|---|---|---|
| [0001](./0001-dark-first-design-tokens.md) | Dark-first design tokens | Accepted | 2026-05 |
| [0002](./0002-canvas-charts-over-apexcharts.md) | Canvas charts over ApexCharts | Accepted | 2026-05 |
| [0003](./0003-optional-peer-dependencies-pattern.md) | Optional peer-dependencies pattern | Accepted | 2026-05 |
| [0004](./0004-playwright-component-tests-for-geometry.md) | Playwright Component Testing for geometry/pointer/ProseMirror | Accepted | 2026-06 |

> ADR-0001..0003 are **retrospective** — they document decisions that were
> already made and shipped (through v1.x). They are recorded now so the
> rationale is preserved before the v2.0 cleanup. ADR-0004 onward are recorded
> as the decisions are made (v1.9+).

## How to add a new ADR

1. Copy [`template.md`](./template.md) to `NNNN-kebab-title.md`, taking the
   **next** number after the highest one in the index above.
2. Fill in the metadata block (status / date / deciders / tags) and the body.
3. Start at `Proposed` if it's under discussion, or `Accepted` if you're
   recording a decision already in force.
4. Add a row to the **Index** table above (keep it sorted by number).
5. If this ADR replaces an earlier one, set the older ADR's status to
   `Superseded by ADR-NNNN` and link both ways.
