# Internal changelog

Tracks internal sweeps that fix bugs, lint issues, hardcoded design tokens,
and toolchain regressions without bumping the package version. For
consumer-facing breaking changes see [`MIGRATION.md`](./MIGRATION.md).

## 2026-05-05 — internal sweep

### Fixed

- `eslint.config.js` (new) — ESLint v10 flat-config was missing entirely, so
  `pnpm lint` failed with "couldn't find an eslint.config.(js|mjs|cjs) file".
  Added a minimal flat config wired to `typescript-eslint` + `eslint-plugin-react`
  + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y` so existing inline
  `// eslint-disable-next-line react/...` directives across the source tree
  resolve to a known rule.
- `package.json` — added `@eslint/js`, `globals`, `typescript-eslint`,
  `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
  to `devDependencies` so the new ESLint config can run without ad-hoc installs.
- `package.json` — re-ordered `exports[".|./icons"]` keys so `types` comes before
  `import`/`require`. tsup was warning that the `types` condition would never
  match because of the previous ordering — fixed.
- `src/components/GanttTimeline/GanttTimeline.tsx` — default `laneHeaderLabel`
  changed from `''` to `'Lane'`. Fixes `GanttTimeline > renders empty without
  error` test that expected `getByText('Lane')` to find the header cell. Not a
  breaking change for consumers — they were already free to pass any string.
- `src/components/Combobox/Combobox.tsx` — silenced
  `react-hooks/exhaustive-deps` warning on the `handleSelect` `useCallback`
  with a justified inline disable. The two missing deps (`emitMulti`,
  `emitSingle`) are thin wrappers around `props.onChange`, and `props` is
  already in the dep list.
- `src/components/DonutChart/DonutChart.tsx` — removed redundant `size` and
  `width` deps from the `draw` `useCallback`. They were transitive (already
  represented by `dim`, `innerR`, etc., which ARE in the deps array). Replaced
  hardcoded hex (`#070715`, `#F8F8F8`, `#9C9CA1`, `#20202D`, the legacy
  segment palette) with `tokens.colors.*` constants where they map cleanly.
  The two extra purple tints (`#4A2AAF`, `#E0D6FC`) stay literal — they are
  segment-only fallback colors that don't map to any existing token.
- `src/components/Image/Image.tsx` — removed the unused `isLoadingState`
  memo and added a justified inline disable for the `useEffect` that
  intentionally omits `imgSrc` from its dep list (including it would loop
  because the effect calls `setSrc(url)` which rewrites `imgSrc`).
- `src/components/Notification/Notification.tsx` — removed unused
  `classNames` import flagged by `@typescript-eslint/no-unused-vars`.
- `src/components/StatCard/StatCard.stories.tsx` — renamed unused decorator
  args `Story, context` to `_Story, _context` so they match the
  `argsIgnorePattern: ^_` convention.
- `src/components/LineChart/LineChart.tsx` — replaced the hardcoded
  `COLORS = ['#6D3EF1', '#B69FF8', '#58A61B', '#C6A328', '#9494C9']` palette
  and the canvas/inline `fillStyle = '#070715' | '#F8F8F8' | '#6A6A73' | …`
  uses with `tokens.colors.*` constants. Also wired the tooltip's inline
  styles to the same source.
- `src/components/Table/Table.tsx` — replaced `border-[#2F1E5E]` with the
  matching token utility class `border-shape_stroke_2_part_two`.
- `src/components/FaqDropdown/FaqList.tsx` — `<ChevrondownIcon color="#B5B5B9" />`
  → `tokens.colors.grey_4`.
- `src/components/Attachment/Attachment.tsx` — `<Icon color="#F8F8F8" />` →
  `tokens.colors.white_4`.
- `src/components/InfoTabs/InfoTabs.tsx` — `<Icon color="#6D3EF1" />` →
  `tokens.colors.pr_purple`.
- `src/components/AnimationButton/AnimationButton.tsx` — `<Icon color="#6D3EF1" />`
  → `tokens.colors.pr_purple`.
- `src/components/VisualGraphEditor/VisualGraphEditor.tsx` — `<Background
  color="#393944" />` and `<MiniMap nodeColor="#6D3EF1" />` rebound to
  `tokens.colors.black_3` / `tokens.colors.pr_purple`.
- `src/components/SelectInput/SelectInput.tsx` — replaced array-index `key={index}`
  on the rendered options list with `key={option.value}`. SelectOption values
  are required to be unique (they're the controlled value), so this is a
  safer key.

### Found, not fixed

- `src/components/SelectInput/SelectDropdownLayout.tsx` — uses
  `bg-[#1B1B27]`, which doesn't match any existing token (closest is
  `black_2 = #20202D`). Switching is a small visual change and could be a
  regression — left to product/design to confirm. Suggested fix: replace
  with `bg-black_2` after a visual review, or add a `--color-black_1_5`
  token at `#1B1B27` if the in-between tone is intentional.
- `src/components/Notification/Notification.tsx` — default `color = '#22C55E'`
  is Tailwind's green-500, not the design-system `success = #58A61B`. Marked
  as a legacy component (use `Toast` instead per `docs/COMPONENT_PICKER.md`).
  Changing the default is a visual breaking change. Suggested fix: track
  through the same legacy deprecation that already moves consumers to `Toast`.
- `src/components/Button/Button.tsx` — does NOT forward `ref`, unlike the
  form-control sweep in B-6 phase 1. Adding `ref?: Ref<HTMLButtonElement>`
  is a non-breaking additive prop, but introducing it now would be a feature
  bump per the sweep contract. Suggested fix: include in the next phase of
  ref-forwarding work.
- `src/components/Tabs/Tabs.tsx` — uncontrolled-only API (`defaultIndex` +
  `onChange`). `API_CONVENTIONS.md` calls for controlled-first
  (`value` + `onChange`) on new components. Changing now is breaking.
  Suggested fix: add a controlled `value`/`onValueChange` pair next to the
  existing props, deprecate `defaultIndex` over a release.

### Toolchain status

- lint: pass (0 errors, 0 warnings)
- test: pass (136/136)
- typecheck: pass
- build: pass (no warnings)

## 2026-05-05 — v1.1 release sweep

### Fixed / added

- **Z-index centralization across overlays.** `Toaster`, `Popover`, `Tooltip`,
  `CommandPalette`, `ConfirmDialog`, and `CookieBanner` now read their layer
  through CSS vars (`var(--z-*)`) instead of hardcoded numeric literals.
  Modal and Drawer keep numeric `Z_*` constants because they need per-stack-depth
  arithmetic (`Z_MODAL + depth * Z_STEP`); the new `Sheet` mirrors that pattern.
- **New `--z-banner: 4500` token** added to `src/tokens/theme.css`. Sits
  between `--z-drawer` (4001) and `--z-toast` (5000) so a sticky `Banner`
  layers above drawers/sheets but below toast notifications. Regenerated
  `src/tokens/tokens.ts` via `node scripts/generate-tokens.mjs` (134 tokens).
- **`LineChart` spline helper extracted** to `src/components/LineChart/spline.ts`
  (`catmullRomSpline`). `LineChart` and `AreaChart` both import it now —
  zero behavior change for `LineChart`.
- **`Modal` ref-forwarding** (closes the "Found, not fixed" Modal item from
  the 2026-05-05 internal sweep). Also added optional
  `motionVariants?: ModalMotionVariants` prop for consumer-supplied
  framer-motion variants (default = current behavior).
- **`Drawer` integrates ModalStack** for proper multi-drawer stacking.
- **`Alert.autoDismiss?: number`**, **`ConfirmDialog.confirmDisabled?: boolean`**,
  **`CookieBanner.position?` + `children?`**, all additive.
- **`Notification`/`NotificationContext`/`NotificationContextProvider`/`NotificationWrapper`**
  marked `@deprecated` in JSDoc, pointing at `Toast`. No runtime change.
  Removal scheduled for v2.0 (see `docs/MIGRATION.md`).
- **28 new vitest tests** (164 total, up from 136): `SegmentedControl` ×9,
  `Stepper` ×9, `Toolbar` ×10. WebGL components and canvas charts skip
  vitest per the existing exception list.
- **4 new optional peers** in `package.json` — `three`, `@react-three/fiber`,
  `@react-three/drei`, `react-force-graph-3d` — declared `optional: true` in
  `peerDependenciesMeta` and added to `tsup.config.ts`'s `external` array
  so consumers who don't render 3D pay zero bytes for them.
- **`src/r3f.d.ts`** (new) — bridges `@react-three/fiber@8`'s `ThreeElements`
  interface into React 19's `React.JSX.IntrinsicElements`. r3f@8 only
  augments the legacy global `JSX` namespace; React 19 resolves intrinsics
  via `React.JSX`. Without this bridge `<mesh>`/`<group>`/`<ambientLight>`
  fail typecheck even though they render correctly. Remove when bumping
  to r3f@9 (which fixes this upstream).
- **`docs/AI_MIGRATION_PROMPT.md`** (new) — paste-ready prompt for AI
  assistants (Claude / Cursor / Copilot) tasked with migrating a consumer
  React app to `@sagtech-infra/ui`. Covers setup, full component catalog,
  picker rules, style conventions, a 7-phase migration workflow, 8
  before/after worked examples, anti-patterns, and a verification
  checklist. Added to `package.json#files` so it ships with the package
  at `node_modules/@sagtech-infra/ui/docs/AI_MIGRATION_PROMPT.md`.
  README.md links it prominently from the top.

### Toolchain status

- lint: pass (0 errors, 0 warnings)
- test: pass (164/164)
- typecheck: pass
- build: pass (no warnings)
