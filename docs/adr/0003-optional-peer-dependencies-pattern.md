# ADR-0003: Optional peer-dependencies pattern

- **Status:** Accepted
- **Date:** 2026-05 <!-- retrospective -->
- **Deciders:** core maintainers
- **Tags:** peer-deps, bundling, tree-shaking, maintenance

> **Retrospective.** This ADR records a decision already shipped across v1.x. It
> is written down now to preserve the rationale — and, importantly, to make the
> "declare in four places" checklist **authoritative** before v2.0.

## Context and Problem Statement

Several components rely on heavy or niche third-party libraries that most
consumers never render: `@xyflow/react`, the `@tiptap/*` family,
`@tanstack/react-virtual`, the `@dnd-kit/*` family, `three` +
`@react-three/fiber` + `@react-three/drei`, `react-force-graph-3d`,
`react-resizable-panels`, `swiper`, and `lowlight`. If these were hard
dependencies, every consumer would pay their install and bundle cost even when
importing a single button. We needed a way to make a component's dependency
*opt-in* and tree-shakable, while still type-checking and building cleanly in
this repo.

## Decision Drivers

- A consumer must **not pay** (install size, bundle weight) for components they
  never render.
- Tree-shaking must work, backed by `sideEffects: false` and dedicated subpath
  exports (`./3d`, `./charts`) so unrelated code is never pulled in.
- The build must keep these libraries **out of `dist`** (externalized), and the
  size budgets must ignore them so `check:size` measures only our own code.

## Considered Options

1. **Hard dependencies** — list everything under `dependencies`; simplest, but
   every consumer pays for everything.
2. **Bundle them in** — inline the libraries into `dist`; removes the install
   step but bloats the bundle and risks duplicate copies at the consumer.
3. **Optional peer dependencies + subpath exports** — declare each as an
   *optional* peer, externalize it from the build, and expose heavy clusters
   behind subpaths.

## Decision Outcome

Chosen option: **"Optional peer dependencies + subpath exports"**, because it
yields a tiny base install (consumers add only the peers for the components they
actually use), keeps `dist` free of third-party weight, and lets bundlers
tree-shake unused clusters via `sideEffects: false` and the `./3d` / `./charts`
subpaths.

The trade-off is a maintenance **footgun**: each optional peer must be declared
in **four** synchronized places, and missing any one causes subtle breakage
(bundling the lib into `dist`, a misleading `check:size` number, or a hard
install requirement). This ADR exists to make that checklist authoritative.

### Authoritative checklist — declare each optional peer in all four places

When adding (or removing) an optional peer dependency, update **all four**:

1. **`package.json` → `peerDependencies`** — add the package with a `>=x`
   range (e.g. `"@xyflow/react": ">=12.0.0"`).
2. **`package.json` → `peerDependenciesMeta`** — add
   `"<pkg>": { "optional": true }` so consumers aren't forced to install it.
3. **`tsup.config.ts` → `external[]`** — add the package (and any deep import
   paths it uses, e.g. `@tiptap/pm/state`) so it is **not bundled** into `dist`.
4. **`.size-limit.json` → `ignore[]`** — add the package to the relevant
   entry's ignore list so `check:size` measures only our own code.

> Forgetting (3) bundles the library into consumer code (bloat + duplicate
> copies); forgetting (4) makes `check:size` report a misleading number;
> forgetting (1)/(2) either fails to express the requirement or turns an
> optional peer into a hard one. Treat the four as a single atomic change.

### Consequences

- **Good** — Crisp, minimal base install; consumers pull only what they render.
- **Good** — `dist` stays free of heavy third-party code; tree-shaking and
  subpath exports keep clusters (`./3d`, `./charts`) isolated.
- **Good** — `check:size` measures our authored code, not vendored libraries.
- **Bad** — "Declare in four places" is error-prone; a single missed location
  produces subtle, easy-to-miss breakage — hence this checklist.
- **Bad** — Consumers must know to install the right peers for advanced
  components (mitigated by docs and `peerDependenciesMeta` surfacing).

## More Information

- `package.json` — `peerDependencies` + `peerDependenciesMeta`.
- `tsup.config.ts` — the `external[]` array.
- `.size-limit.json` — per-entry `ignore[]` lists.
- `package.json#exports` — the `./3d` and `./charts` subpaths.
