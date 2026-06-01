# @sagtech-infra/ui

Internal React component library for SagTech products. Dark-mode-only, Tailwind v4, React 19 / Next 15+.

Storybook covers every component with live examples — run `pnpm dev` and open [localhost:6006](http://localhost:6006).

> **Migrating an existing React app to this library?** See [`docs/AI_MIGRATION_PROMPT.md`](./docs/AI_MIGRATION_PROMPT.md) — a paste-ready prompt for Claude / Cursor / Copilot that walks an AI assistant through a phased, non-breaking migration (setup → forms → overlays → data → charts), with picker rules, worked examples, and anti-patterns. It also ships inside the package at `node_modules/@sagtech-infra/ui/docs/AI_MIGRATION_PROMPT.md`.

---

## Install

```bash
# Package is published to GitHub Packages under the @sagtech-infra scope.
# Consumers need a PAT with read:packages. Add to ~/.npmrc or the project's .npmrc:
#
#   @sagtech-infra:registry=https://npm.pkg.github.com
#   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

pnpm add @sagtech-infra/ui
```

For local development against a checked-out copy:

```bash
# Clone as a sibling, depend via workspace:* or file:, then:
cd sagtech-ui
pnpm install
pnpm build
```

## Peer dependencies

**Required** (install always): `react@^19`, `react-dom@^19`, `classnames`, `framer-motion`.

**Optional** (install only if you use the relevant component):

| Peer | Required by |
|---|---|
| `next@^15` | `Steps`, `InfoTabs`, `Point`, `CardWrapper` (can be bypassed via `<SagtechUIProvider imageComponent={...} linkComponent={...}>`) |
| `react-hook-form` | `Form` + `FormField`/`FormLabel`/`FormControl`/`FormError`/`FormHint` |
| `react-international-phone`, `libphonenumber-js` | `PhoneInput` |
| `swiper` | `Timeline` |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | `SortableList` |
| `@tanstack/react-virtual` | `VirtualList` |
| `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit` | `RichTextEditor` |
| `@xyflow/react` | `VisualGraphEditor` |
| `react-resizable-panels` | `PanelGroup` / `Panel` / `PanelResizeHandle` |
| `three`, `@react-three/fiber`, `@react-three/drei` | `Globe3D`, `Scene3D`, `Mindmap3D` |
| `three`, `@react-three/fiber`, `@react-three/drei`, `react-force-graph-3d` | `Network3D` (in addition to the three packages above) |

## Tokens and fonts

Import the design tokens (raw CSS `@theme` block) once at the top of your global stylesheet:

```css
/* app/globals.css or similar */
@import '@sagtech-infra/ui/tokens';
```

The token scale covers: colors (`black_1..4`, `white_1..4`, `grey_1..4`, `pr_purple`, `sec_purple`, `pr_blue`, `sec_blue`, `success`, `warning`, `error`), spacing (`4/6/7/8/10/11/12/15/16/20/23/24/30/32/40/48/52/56/60/62/64/72/88/117/157` px), z-index overlay layers (`--z-dropdown/popover/modal/drawer/toast/tooltip`), breakpoints, fonts, radii, shadows.

Typed constants are also exported as `tokens`:

```tsx
import { tokens } from '@sagtech-infra/ui';
tokens.colors.pr_purple; // '#6D3EF1'
tokens.spacing['16px']; // '16px'
```

Fonts — `--font-manrope`, `--font-orbitron`, `--font-roboto`. In Next.js, wire via `next/font` and expose on `:root`. In non-Next projects, install `@fontsource/manrope|orbitron|roboto` and set the vars yourself.

**Dark mode only.** No light-mode equivalents in the palette; no `prefers-color-scheme` handling.

## Quick start

```tsx
import {
  SagtechUIProvider,
  ConfirmProvider,
  Toaster,
  Button,
  useConfirm,
  toast,
} from '@sagtech-infra/ui';
import Link from 'next/link';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <SagtechUIProvider linkComponent={Link}>
      <ConfirmProvider>
        {children}
        <Toaster position="top-right" />
      </ConfirmProvider>
    </SagtechUIProvider>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const confirm = useConfirm();
  return (
    <Button
      text="Delete"
      variant="danger"
      buttonSize="small"
      onClick={async () => {
        const ok = await confirm({
          title: 'Delete this item?',
          description: 'This action cannot be undone.',
          variant: 'danger',
          confirmText: 'Delete',
        });
        if (ok) {
          await onDelete();
          toast.success('Deleted');
        }
      }}
    />
  );
}
```

---

## Imports & bundle isolation

The main entry re-exports everything, so `import { ... } from '@sagtech-infra/ui'` keeps working for all components. The package is marked `"sideEffects": false`, so a tree-shaking bundler (Webpack/Turbopack/Vite/Rollup) drops anything you don't import — importing only what you use keeps heavy peers (notably `three`) out of your bundle. CSS is shipped separately via the `./tokens` export, so it is never tree-shaken away.

For explicit isolation of the heavy families, two **additive** subpath exports are available alongside the main entry:

```tsx
// Main entry — everything (still works, non-breaking)
import { Button, AreaChart, Globe3D } from '@sagtech-infra/ui';

// 3D / WebGL family only (pulls in three + @react-three/* peers)
import { Network3D, Globe3D, Scene3D, Mindmap3D } from '@sagtech-infra/ui/3d';

// The 12 canvas charts only (no extra peers)
import { AreaChart, BarChart, GaugeChart } from '@sagtech-infra/ui/charts';
```

Reaching for the subpath makes the dependency boundary explicit and keeps the 3D peers off any code path that imports from `@sagtech-infra/ui/3d` nowhere. `size-limit` budgets guard each entry (`main` / `icons` / `3d` / `charts`); run `pnpm check:size` to verify locally — CI runs it on every push and PR.

---

## Component overview

### Foundations

| Component | Purpose |
|---|---|
| `Typography` | Polymorphic text. `tag`: `h1..h4`/`p`/`span`/`label` (+`htmlFor`); `type`: `BodyXL..BodyXS`/`Labels`/`LabelsS`/`Info`/`InfoBold`/`Buttons`/`ButtonsS`/`ButtonsBold`/`M3HeadlineSmall`/`MetricsTitle`/`MetricsXL`/`TabInfoTitle`/`HeroSubtitle`/`DisplayXL`/`DisplayL`/`SectionTitleL`/`SectionTitleM`/`SectionTitleS`. |
| `Icon` | 150+ icons (nav-chrome, status, tech-stack, social). `<Icon icon="call" size={24} color="#6D3EF1" />`. |
| `Skeleton` | Loading placeholder + presets `SkeletonText`/`SkeletonAvatar`/`SkeletonCard`/`SkeletonTable`/`SkeletonList`. |
| `Divider` | Horizontal/vertical with `variant: 'solid' \| 'dashed'`. |
| `KBD` | Keyboard-shortcut chip group. `<KBD keys={['Cmd', 'K']} size="sm" />`. |

### Form controls

| Component | Purpose |
|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'danger' \| 'tabButton' \| 'tabButtonWhite'`, `buttonSize: 'small' \| 'large' \| 'tabSize'`, `loadingType`, `disabled`. |
| `Input` | Dark text input with `state='default'\|'active'`, `isError` + `errorMessage` (wired to `aria-invalid`/`aria-describedby`), `externalLabel`. |
| `TextArea` | Same contract as `Input`, multi-line. |
| `Checkbox` | Controlled; `label` rendered inside a native `<label>`. |
| `Toggle` | `checked` + `onChange(boolean)`, `size: 'sm' \| 'md'`. |
| `Switch` | Labeled form switch — `checked` + `onCheckedChange(boolean)`, label slot, `disabled`. Use when you need an inline `<label>` association; `Toggle` for the bare control. |
| `Slider` / `RangeInput` | Single-thumb `Slider` and two-thumb `RangeInput` — `min`/`max`/`step`, `marks`, keyboard nav, RTL, ARIA `slider`. |
| `TimePicker` | Standalone hours + minutes picker (`timeStep` default 5). Extracted from `DatePicker.showTime`; compose either independently. |
| `ColorPicker` | HSL + alpha editing via reused `Slider` inside a `Popover`, validated hex input, preset swatches. |
| `RadioGroup` | `options: { label, value }[]` + `value` + `onChange`. |
| `SelectInput` | Controlled select with optional multi-select. Full keyboard nav (Arrow/Home/End/Enter/Esc, open-to-selected). Deprecated `onSelect` alias. |
| `Combobox` | Searchable single/multi select with async-options support, portal dropdown. |
| `Form` + `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormError` / `FormHint` | `react-hook-form` wrappers. Works with any of the inputs above. |
| `DatePicker` | Controlled date with optional `showTime` (hours+minutes, `timeStep` default 5). |
| `DateRangePicker` | Same as `DatePicker` but `{ start, end }`. Shares calendar helpers. |
| `Dropzone` | Basic drag-and-drop zone, returns `File[]` via `onDrop`. |
| `FileDropzone` | Opinionated uploader: controlled `files: FileUploadItem[]` with per-file `status`/`progress`/`errorMessage`, image preview, retry, `maxFiles`/`maxSize`. |
| `Attachment` | Single-file inline upload (paperclip-style). |
| `PhoneInput` | International phone input with auto country-detection (`detectCountry()` returns `CountryIso2`). |
| `TagInput` | Token/tag editor with comma + Enter to add. |
| `DropdownMenu` | Trigger + menu items (danger, disabled, divider). Full keyboard nav (Arrow/Home/End/Enter/Esc, type-ahead). |
| `SearchBar` | Debounced search input. |
| `InlineEdit` | Click-to-edit. Enter/Esc to save/cancel, `multiline` with Cmd+Enter, `validate`, async `onSave`. |
| `VariablePicker` | Modal with searchable + source-filtered list of template variables. Double-click / Insert returns the picked token. |
| `RichTextEditor` | TipTap wrapper with bold/italic/strike/heading/list/quote/code/undo/redo toolbar. Extensions prop for custom nodes. |
| `SegmentedControl` | iOS-style segmented toggle group. Controlled `value`/`onChange`, sizes, full-width, disabled, keyboard arrow navigation. |

### Layout & overlays

| Component | Purpose |
|---|---|
| `Modal` | Portal dialog with `size: 'sm' \| 'md'`, optional `title` / `footer` slots. Full a11y — `role="dialog"`, `aria-modal`, focus-trap (Tab cycles), autofocus first focusable, focus-restore on close. Stack-aware — nested modals get correct z-index and Escape closes topmost. |
| `Drawer` | Side panel (`position: 'left' \| 'right'`) with backdrop, animated via framer-motion. |
| `ConfirmDialog` + `ConfirmProvider` + `useConfirm` + `useConfirmWithNote` | Imperative `await confirm({ … })` → `Promise<boolean>`. `useConfirmWithNote` adds a `TextArea` and returns `{ confirmed, note }`. |
| `CommandPalette` + `CommandPaletteProvider` + `useRegisterCommand` | Cmd+K palette. Provider registers hotkey + collects commands from the subtree via `useRegisterCommand`. |
| `Sidebar` | Desktop nav with `items`, `collapsed`, optional `header` / `footer`. |
| `CardWrapper` | Bordered container with gradient stroke + optional `href` (hover-lift, purple glow). |
| `Container` | Page centering with `size: 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`. |
| `SectionTag` | Small badge-like section label. |
| `Breadcrumbs` | Nav crumb trail. |
| `CookieBanner` | Accept/Decline banner with local cookie write. |
| `Popover` | Trigger + floating content (position + align). Escape closes, focus returns to trigger. |
| `Tooltip` | Hover/focus tooltip. |
| `Sheet` | Side panel (`left`/`right`/`top`/`bottom`) with full ModalStack stacking, focus-trap, scroll-lock. Use over `Drawer` when stacking with other sheets/modals matters. |
| `BottomSheet` | Mobile-first bottom drawer with drag-to-dismiss + multi-snap-points (framer-motion `drag="y"`). |
| `FAB` | Floating action button anchored to viewport (`bottom-right`/`bottom-left`/`top-right`/`top-left`), optional `extended` pill with label, `loading` state. |
| `Toolbar` (+ `Toolbar.Separator` / `ToolbarSeparator`) | Action bar — group of buttons with arrow-key roving focus, `role="toolbar"`, optional separators. |
| `Carousel` | Peer-free slider on CSS scroll-snap. Autoplay (honors `prefers-reduced-motion`), dots/arrows, keyboard nav, RTL. No `swiper` peer required. |
| `PanelGroup` (+ `Panel` / `PanelResizeHandle`) | Resizable split layout — horizontal/vertical, drag handles, optional persistence. Wraps `react-resizable-panels` (optional peer). |

### Data display

| Component | Purpose |
|---|---|
| `Table` | Simple table with `columns` + `data`, optional local sort. Generic over row type. |
| `DataTable` | Richer version — controlled sort, selection (checkbox column), sticky header, loading skeleton, empty state. |
| `Badge` | `variant: 'filled' \| 'outlined' \| 'subtle'`, `color`, `size`, optional `dot`. |
| `Avatar` / `AvatarCard` | Picture + initials fallback. Card variant adds name + role. |
| `AvatarGroup` | Overlapping avatar stack with a `+N` overflow counter (`max` cap). |
| `TreeView` | ARIA `tree` — expandable nodes, roving tabindex + type-ahead, lazy-loaded children, controlled-first, RTL. |
| `Calendar` | Standalone date grid (Monday-first, RTL) extracted from `DatePicker`. Use directly for inline date selection. |
| `Tabs` | In-app tab navigation (controlled). |
| `InfoTabs` | Marketing tabs with icons + rich content panes. |
| `Timeline` | Swiper-based horizontal image timeline. |
| `GanttTimeline` | Project Gantt: scale day/week/month, ISO-week labels, lane grouping with automatic sub-row packing when tasks overlap, optional detail-modal via `renderItemDetail`. |
| `Steps` | Presentational stepper with animated progress line. |
| `Wizard` + `useWizard` | Multi-step flow. Compound (`Wizard.Root`/`Progress`/`Content`/`Footer`) + hook for custom layouts. |
| `Point` | Small dot + label marker. |
| `ResultPill` | Chip showing a labelled result (status + value). |
| `Image` / `LazyImage` | Plain `<img>` wrappers with shimmer placeholder + error fallback. |
| `Pagination` | Compact paginator with next/prev + page-jump. |
| `StatCard` | KPI card with label, value, trend indicator. |
| `DataTable` | (see above) |
| `Rate` | Read-only N-star rating with auto or explicit tone. |
| `FaqDropdown` + `FaqList` | Accordion FAQ. |
| `Timeline` | (see above) |
| `SortableList` | Drag-and-drop reorderable list on `@dnd-kit`. Vertical/horizontal/grid. |
| `VirtualList` | Windowed list on `@tanstack/react-virtual` for 10k+ items. |
| `VisualGraphEditor` | ReactFlow wrapper — nodes/edges/handles/minimap/controls + `readOnly`. |
| `AreaChart` | Canvas-based stacked/non-stacked area chart with optional gradient fill, hover crosshair + tooltip. |
| `BarChart` | Canvas bar/column chart — vertical/horizontal, stacked, grouped. |
| `HeatmapChart` | Discrete cell matrix with linear color ramp (default `pr_purple` → `sec_purple`). |
| `RadarChart` | Polygon chart with grid rings + axis labels. |
| `SparklineChart` | Tiny inline trend line (default 80×24) with `tone: 'success'\|'warning'\|'error'\|'neutral'`. Use inside `StatCard`. |
| `ScatterChart` | Bubble scatter with optional per-point `size`. |
| `GaugeChart` | Half-circle speedometer with `min`/`max`/`thresholds`. |
| `SankeyChart` | Layered flow diagram (no `d3-sankey` peer — layout inlined on canvas). |
| `TreemapChart` | Squarified treemap with optional `padding`. |
| `FunnelChart` | Vertical/horizontal funnel showing conversion % per stage. |
| `Stepper` | Richer step indicator — per-step `status: 'pending'\|'active'\|'complete'\|'error'`, `description`, click-to-jump, vertical or horizontal. |

### 3D / WebGL

| Component | Purpose |
|---|---|
| `Network3D` | 3D force-directed network graph backed by `react-force-graph-3d`. |
| `Globe3D` | Interactive globe with raised lat/lng markers (`@react-three/fiber` + `@react-three/drei`). |
| `Scene3D` | Generic `<Canvas>` wrapper for ad-hoc 3D scenes (orbit controls + default lighting). |
| `Mindmap3D` | Hierarchical 3D mindmap rendered as nodes + edges around a sphere. |

### Feedback

| Component | Purpose |
|---|---|
| `Alert` | Inline banner (`info`/`success`/`warning`/`error`), optional title/body/icon/action/close, optional `autoDismiss` ms. `role="alert"` for error, `role="status"` otherwise. |
| `Banner` | Page-level sticky banner (top/bottom). Variants like `Alert` but persistent and viewport-anchored — distinct from inline `Alert` and legal `CookieBanner`. |
| `Spotlight` | Onboarding/feature highlight — clip-path-style cutout around a `targetRef` + tooltip card with optional Next/Skip + step counter. |
| `Toaster` + `toast` | Global toast API — `toast.success()`/`.error()`/`.info()`/`.warning()`/`.loading()` + `toast.promise()`. Compact layout, auto-sized to content. |
| `Notification` + `NotificationWrapper` + `NotificationContext` + `NotificationContextProvider` | Legacy notification API (kept for back-compat). Prefer `Toast`. |
| `NotificationCenter` | Bell icon + dropdown with notifications list, badge count, mark-as-read / mark-all-read / clear-all. Prop-driven (consumer owns data fetching). |
| `EmptyState` | Empty placeholder — `variant: 'inline' \| 'card'`, optional icon/description/action. |
| `ProgressBar` | Determinate bar with variants + optional animation. |
| `CodeBlock` | Syntax-highlighted code (ts/tsx/js/jsx/json/bash/css/html built-in; plug Prism/Shiki via `highlight` prop). Copy button, line numbers, `maxHeight`. |
| `AnimationButton` | Branded pill-style CTA with hover expand (desktop only). |
| `CookieBanner` | (also in Layout) |
| `SliderArrow` | Reusable nav arrow for Swiper carousels. |
| `LineChart` / `DonutChart` | Canvas/SVG charts (theme-aware) with the SagTech palette. |

### Providers & hooks

| Export | Purpose |
|---|---|
| `SagtechUIProvider` | Injects `linkComponent` / `imageComponent` slot replacements so non-Next projects can drop-in the library without aliasing `next/image` etc. |
| `ConfirmProvider` | Root provider for imperative confirm modals. |
| `CommandPaletteProvider` | Global Cmd+K palette provider. |
| `useWindowSize`, `useDeviceType`, `useIntersectionObserver`, `useOutsideClick`, `useModals`, `useStatusColor` | Utility hooks. |
| `useRovingTabindex`, `useTypeahead` | A11y primitives behind `TreeView` / list-style keyboard nav — reusable in custom widgets. |
| `useThemeColors` | Reads the active palette from CSS custom properties and re-reads on `data-theme` change. Powers theme-aware canvas charts; usable in any canvas/SVG renderer. |
| `useConfirm`, `useConfirmWithNote` | Imperative dialog APIs. |
| `useCommandPalette`, `useRegisterCommand` | Register/open command palette. |
| `useWizard` | Stand-alone hook (with `Wizard` compound). |

### Icons

Icons live at `@sagtech-infra/ui/icons`:

```tsx
import { content as iconContent, type IAvailableIcons } from '@sagtech-infra/ui/icons';
```

Or render via the `<Icon>` component: `<Icon icon="menu" size={20} color="#CDCDD0" />`. Available keys include app-chrome (`menu`, `plus`, `edit`, `trash`, `eye`, `filter`, `search`, `settings`, `calendar`, `users`, `document`, `lock`), status (`info`, `warning`, `error`, `success`, `checkCircle`, `alertTriangle`), navigation (`arrow`, `chevrondown`, `chevronLeft`, `chevronRight`, `close`, `paginationArrow`), and a large tech-stack catalogue (`React`, `TypeScript`, `PostgreSQL`, `Docker`, `AWS`, `OpenAI`, `Anthropic`, …).

---

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Storybook dev server on port 6006 |
| `pnpm build` | `tsup` build → `dist/` (ESM + CJS + types). Runs `generate:tokens` via `prebuild` |
| `pnpm build-storybook` | Static Storybook build |
| `pnpm test` | Vitest run (happy-dom + React Testing Library, 164 tests) |
| `pnpm test:watch` | Watch mode |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm generate:tokens` | Parses `src/tokens/theme.css` → `src/tokens/tokens.ts` (typed constants) |
| `pnpm check:size` | `size-limit` budgets for the `main` / `icons` / `3d` / `charts` entries (also run in CI) |

## Docs

- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — completed + planned work with audit references
- [`docs/API_CONVENTIONS.md`](./docs/API_CONVENTIONS.md) — callback-naming, prop-shape, ref-forwarding rules
- [`docs/MIGRATION.md`](./docs/MIGRATION.md) — breaking changes per version + package-name migration
- [`docs/COMPONENT_PICKER.md`](./docs/COMPONENT_PICKER.md) — shortcut for choosing between `Dropzone`/`Attachment`/`FileDropzone`, `Tabs`/`InfoTabs`, `Modal`/`Drawer`/`CommandPalette`, `Toast`/`Alert`/`NotificationCenter`, etc.
- [`CLAUDE.md`](./CLAUDE.md) — agent-readable overview for Claude Code / other assistants

## Publishing

Tag-driven via `.github/workflows/publish.yml`:

1. Bump `version` in `package.json` on `main`.
2. `git tag v1.0.0 && git push --tags`.
3. CI verifies the tag matches `package.json#version`, builds, and publishes to GitHub Packages (`@sagtech-infra` scope).

Tags that don't match `package.json#version` fail the publish step.
