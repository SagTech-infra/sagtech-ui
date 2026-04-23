# @sagtech-infra/ui

Internal React component library for SagTech products. Dark-mode-only, Tailwind v4, React 19 / Next 15+.

Storybook covers every component with live examples — run `pnpm dev` and open [localhost:6006](http://localhost:6006).

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
| `apexcharts`, `react-apexcharts` | `LineChart`, `DonutChart` |
| `swiper` | `Timeline` |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | `SortableList` |
| `@tanstack/react-virtual` | `VirtualList` |
| `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit` | `RichTextEditor` |
| `@xyflow/react` | `VisualGraphEditor` |

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

## Component overview

### Foundations

| Component | Purpose |
|---|---|
| `Typography` | Polymorphic text. `tag`: `h1..h4`/`p`/`span`/`label` (+`htmlFor`); `type`: `BodyXL..BodyXS`/`Labels`/`LabelsS`/`Info`/`InfoBold`/`Buttons`/`ButtonsS`/`ButtonsBold`/`M3HeadlineSmall`/`MetricsTitle`/`MetricsXL`/`TabInfoTitle`/`HeroSubtitle`/`DisplayXL`/`DisplayL`/`SectionTitleL`/`SectionTitleM`/`SectionTitleS`. |
| `Icon` | 150+ icons (nav-chrome, status, tech-stack, social). `<Icon icon="call" size={24} color="#6D3EF1" />`. |
| `Skeleton` | Loading placeholder + presets `SkeletonText`/`SkeletonAvatar`/`SkeletonCard`/`SkeletonTable`/`SkeletonList`. |
| `Divider` | Horizontal/vertical with `variant: 'solid' \| 'dashed'`. |

### Form controls

| Component | Purpose |
|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'danger' \| 'tabButton' \| 'tabButtonWhite'`, `buttonSize: 'small' \| 'large' \| 'tabSize'`, `loadingType`, `disabled`. |
| `Input` | Dark text input with `state='default'\|'active'`, `isError` + `errorMessage` (wired to `aria-invalid`/`aria-describedby`), `externalLabel`. |
| `TextArea` | Same contract as `Input`, multi-line. |
| `Checkbox` | Controlled; `label` rendered inside a native `<label>`. |
| `Toggle` | `checked` + `onChange(boolean)`, `size: 'sm' \| 'md'`. |
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

### Data display

| Component | Purpose |
|---|---|
| `Table` | Simple table with `columns` + `data`, optional local sort. Generic over row type. |
| `DataTable` | Richer version — controlled sort, selection (checkbox column), sticky header, loading skeleton, empty state. |
| `Badge` | `variant: 'filled' \| 'outlined' \| 'subtle'`, `color`, `size`, optional `dot`. |
| `Avatar` / `AvatarCard` | Picture + initials fallback. Card variant adds name + role. |
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

### Feedback

| Component | Purpose |
|---|---|
| `Alert` | Inline banner (`info`/`success`/`warning`/`error`), optional title/body/icon/action/close. `role="alert"` for error, `role="status"` otherwise. |
| `Toaster` + `toast` | Global toast API — `toast.success()`/`.error()`/`.info()`/`.warning()`/`.loading()` + `toast.promise()`. Compact layout, auto-sized to content. |
| `Notification` + `NotificationWrapper` + `NotificationContext` + `NotificationContextProvider` | Legacy notification API (kept for back-compat). Prefer `Toast`. |
| `NotificationCenter` | Bell icon + dropdown with notifications list, badge count, mark-as-read / mark-all-read / clear-all. Prop-driven (consumer owns data fetching). |
| `EmptyState` | Empty placeholder — `variant: 'inline' \| 'card'`, optional icon/description/action. |
| `ProgressBar` | Determinate bar with variants + optional animation. |
| `CodeBlock` | Syntax-highlighted code (ts/tsx/js/jsx/json/bash/css/html built-in; plug Prism/Shiki via `highlight` prop). Copy button, line numbers, `maxHeight`. |
| `AnimationButton` | Branded pill-style CTA with hover expand (desktop only). |
| `CookieBanner` | (also in Layout) |
| `SliderArrow` | Reusable nav arrow for Swiper carousels. |
| `LineChart` / `DonutChart` | ApexCharts wrappers with the SagTech palette. |

### Providers & hooks

| Export | Purpose |
|---|---|
| `SagtechUIProvider` | Injects `linkComponent` / `imageComponent` slot replacements so non-Next projects can drop-in the library without aliasing `next/image` etc. |
| `ConfirmProvider` | Root provider for imperative confirm modals. |
| `CommandPaletteProvider` | Global Cmd+K palette provider. |
| `useWindowSize`, `useDeviceType`, `useIntersectionObserver`, `useOutsideClick`, `useModals`, `useStatusColor` | Utility hooks. |
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
| `pnpm test` | Vitest run (happy-dom + React Testing Library, 136 tests) |
| `pnpm test:watch` | Watch mode |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm generate:tokens` | Parses `src/tokens/theme.css` → `src/tokens/tokens.ts` (typed constants) |

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
