# ADR-0006: v2.0 breaking-cleanup window

- **Status:** Accepted
- **Date:** 2026-06
- **Deciders:** core maintainers
- **Tags:** breaking, api, peer-deps, naming

## Context and Problem Statement

Through v1.1–v1.9 the library accumulated deprecated APIs (the `Notification`
family, `SelectInput.onSelect`/`register`/`name`, `Tabs.defaultIndex`,
`Attachment.onUpload`) and naming that diverges from `docs/API_CONVENTIONS.md`
(notably `externalLabel` vs the canonical static `label`). It also carried a
hand-written `src/r3f.d.ts` JSX bridge to keep `@react-three/fiber` v8 working
under React 19. Each item shipped with a `@deprecated` marker pointing at v2.0
as the removal target. The question: do we drain this debt incrementally
(spread across several minors) or in one major release?

## Decision Drivers

- SemVer: breaking removals require a major bump; trickling them out breaks
  consumers repeatedly.
- A single, well-documented migration (codemods + `docs/MIGRATION.md`) is
  cheaper for consumers than N scattered ones.
- The r3f v8→v9 peer bump is itself breaking and is the natural moment to drop
  the `r3f.d.ts` bridge (v9 augments `react/jsx-runtime` natively).
- Naming consistency (`label`, `onChange`) lowers long-term API surface cost.

## Considered Options

1. **One breaking window (v2.0)** — remove every deprecated API, align naming,
   bump r3f peers, ship codemods, all at once.
2. **Incremental removal** — drop one or two deprecations per minor over time.
3. **Indefinite deprecation** — keep the aliases forever behind `@deprecated`.

## Decision Outcome

Chosen option: **"One breaking window (v2.0)"**, because it bounds consumer pain
to a single upgrade with a complete migration path, and lets the r3f peer bump
(which is breaking regardless) land in the same major rather than forcing a
later one. Internal stories/tests are migrated alongside each removal so the
gate stays green per phase.

### Consequences

- **Good** — the public API now conforms to `docs/API_CONVENTIONS.md`
  (controlled-first, canonical `label`/`onChange`); no lingering deprecated
  aliases.
- **Good** — `src/r3f.d.ts` is deleted; fiber 9 provides the JSX bridge upstream.
- **Good** — every rename ships a jscodeshift codemod (with fixtures) that
  automates the safe parts and flags structural cases.
- **Bad** — consumers must do a coordinated upgrade (esp. `Notification`→`Toast`
  provider→imperative, and the r3f 9 / drei 10 peer bump).
- **Bad** — fiber 9's global `ThreeElements` augmentation pulls three.js
  intrinsics into `React.ElementType`, which broke the polymorphic `Inline`/
  `Stack`; they now render via `React.createElement` to sidestep it.

## More Information

- Migration guide: `docs/MIGRATION.md` (v1.9 → v2.0).
- Codemods: `scripts/codemod-v2/` (+ `scripts/codemod-v2/README.md`).
- Related: ADR-0005 (preserve "use client"), ADR-0003 (optional peer-deps).
