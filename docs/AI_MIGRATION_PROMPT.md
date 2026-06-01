# AI Migration Prompt — `@sagtech-infra/ui`

> **Version:** ships with `@sagtech-infra/ui@1.1.0` (May 2026).
> **Audience:** another AI assistant (Claude, Cursor, Copilot, Codex, etc.) that has been asked to migrate a React app to use this library.
> **Format:** self-contained — paste this whole file into the assistant's context (or `@`-attach it) at the start of a migration session. The assistant has everything it needs to plan and execute. The human user does not need to give additional setup instructions.

---

## How to use this document (for the human)

You are asking an AI to migrate your React app to `@sagtech-infra/ui`. To get good results:

1. **Open this file in your AI tool of choice** (Claude Max, Cursor, Copilot CLI, etc.) at the start of the session.
2. **Tell the assistant**: "Migrate this app's UI to `@sagtech-infra/ui` following `docs/AI_MIGRATION_PROMPT.md`. Plan the work, get my approval, then execute cluster by cluster."
3. **Be ready to authenticate** — the package is on GitHub Packages (private). The assistant will need a `NODE_AUTH_TOKEN` with `read:packages` to install. Provide it via `~/.npmrc` or environment variable; do **not** share the token in the chat.
4. **Approve cluster by cluster.** The assistant should not migrate the entire app in one shot. It should land setup → forms → overlays → data → charts in waves, with `pnpm typecheck && pnpm test` between each wave.

If your AI assistant is fully autonomous (Claude Max, Cursor agent mode), it can execute commands directly. If it's chat-only (ChatGPT web, plain Copilot), you'll be the one running `pnpm install`, `pnpm typecheck`, etc. — the assistant will tell you what to run.

---

## Mission (for the assistant)

You are migrating a consumer React app to `@sagtech-infra/ui` — SagTech's internal component library. Your job is to **replace existing UI with sagtech-ui equivalents end to end**, not to write a new design system on top.

### Hard rules

1. **Use `@sagtech-infra/ui` first.** If a component exists in this library, use it. Do **not** install or import shadcn/ui, MUI (`@mui/*`), Chakra (`@chakra-ui/*`), Ant Design (`antd`), Mantine, react-bootstrap, or HeadlessUI. If those are already installed, plan to remove them at the end of the migration.
2. **If a component is missing,** build it locally inside the consumer app using the sagtech-ui tokens, fonts, and Tailwind utilities documented below. **Do not** invent a parallel design system. Flag missing components to the human at the end so they can be upstreamed.
3. **Tokens-only styling.** No hardcoded hex colors, no hardcoded px (outside calc'd canvas math). Use `bg-black_1`, `p-24px`, `rounded-24px`, `tokens.colors.pr_purple`. Reach for an existing token before adding a new one.
4. **Dark-mode only.** This is intentional. Do not add a light-mode toggle. Do not add a `prefers-color-scheme` listener. If the app currently has a theme toggle, plan to remove it (with the human's approval) and standardize on dark.
5. **No deep imports.** Always import from the package root: `import { Button, Modal, toast } from '@sagtech-infra/ui'`. Never `from '@sagtech-infra/ui/dist/...'`.
6. **Controlled-first.** New code uses `value` + `onChange` (or `open` + `onOpenChange` for overlays). Avoid uncontrolled forms unless the consumer has a strong reason (e.g. an existing `defaultValue`-driven flow you can't refactor in one pass).
7. **Preserve behavior.** Migration should not change product behavior. Match existing variants, sizes, copy, and interaction details. If you find a bug in existing behavior, surface it to the human — don't silently "improve" it.

### Soft rules

- Lean on the library's hooks (`useConfirm`, `useWizard`, `useStatusColor`, etc.) before writing your own.
- Use `Toaster` + the imperative `toast` API for transient feedback. Avoid `Notification` (it's `@deprecated` in v1.1).
- For multi-step flows, prefer `Wizard` over hand-rolled stepper state machines.
- For tables with sort/select/sticky-header needs, use `DataTable` (richer) over `Table` (simple).

---

## Setup checklist

Run these in order in the consumer repo. The first three are required; the rest depend on what the app actually uses.

### 1. Install the package

```bash
# In the consumer repo
pnpm add @sagtech-infra/ui
# or: npm install @sagtech-infra/ui
# or: yarn add @sagtech-infra/ui
```

If install fails with `404` or `401`, the registry config is missing. Add to `.npmrc` (or `~/.npmrc`):

```
@sagtech-infra:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

The user must export `NODE_AUTH_TOKEN` (a GitHub PAT with `read:packages`) in their shell. Do **not** ask for the token in chat.

### 2. Install required peers

```bash
pnpm add react@^19 react-dom@^19 classnames framer-motion
```

If the app is on React 18, the human must upgrade to 19 first. Flag this clearly — the library does not support React 18 (peerDependencies enforce it).

### 3. Wire up tokens

Add to the **top** of the global stylesheet (before any other rules) — typically `app/globals.css` (Next.js App Router), `src/index.css` (Vite), or wherever the Tailwind directives live:

```css
@import '@sagtech-infra/ui/tokens';
```

This brings in colors, spacing, fonts, z-index layers, breakpoints, radii, shadows as a Tailwind v4 `@theme` block. The app must be on **Tailwind v4** — if it's on v3, plan a Tailwind upgrade as a prerequisite.

### 4. Install only the optional peers you actually need

Skip any row whose component the app does not use.

| If the app uses…  | Install                                              |
|---|---|
| `Steps`, `InfoTabs`, `Point`, `CardWrapper` (with `href`) | `next` (already there if it's a Next app); else use `<SagtechUIProvider>` (step 6) |
| `Form` + `FormField`/`FormControl`/`FormError`/etc. | `react-hook-form` |
| `PhoneInput` | `react-international-phone libphonenumber-js` |
| `Timeline` | `swiper` |
| `SortableList` | `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` |
| `VirtualList` | `@tanstack/react-virtual` |
| `RichTextEditor` (core) | `@tiptap/core @tiptap/react @tiptap/starter-kit` |
| `createMentionExtension` preset | above + `@tiptap/extension-mention @tiptap/suggestion` |
| `createSlashCommandExtension` preset | above + `@tiptap/suggestion` |
| `createImageUploadExtension` preset | above + `@tiptap/extension-image @tiptap/pm` |
| `VisualGraphEditor` | `@xyflow/react` |
| `Globe3D`, `Scene3D`, `Mindmap3D` | `three @react-three/fiber @react-three/drei` |
| `Network3D` | `three @react-three/fiber @react-three/drei react-force-graph-3d` |

### 5. Wire up fonts

The library expects three font families, exposed as CSS variables on `:root`:

- `--font-manrope` (primary text)
- `--font-orbitron` (display headlines)
- `--font-roboto` (data tables, code adjacent)

**Next.js (App Router):**

```tsx
// app/layout.tsx
import { Manrope, Orbitron, Roboto } from 'next/font/google';
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${orbitron.variable} ${roboto.variable}`}>
      <body className="bg-black_1 text-white_4">{children}</body>
    </html>
  );
}
```

**Vite / CRA / non-Next:**

```bash
pnpm add @fontsource/manrope @fontsource/orbitron @fontsource/roboto
```

```ts
// src/main.tsx
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
```

```css
/* src/index.css */
:root {
  --font-manrope: 'Manrope', sans-serif;
  --font-orbitron: 'Orbitron', sans-serif;
  --font-roboto: 'Roboto', sans-serif;
}
```

### 6. Wrap the app in `SagtechUIProvider` (and any imperative providers you need)

Required for non-Next consumers (Vite, CRA, Electron) to provide framework-agnostic shims for `next/image` and `next/link`. Recommended for Next consumers too — gives a clean place to add future global config.

```tsx
// app/providers.tsx (Next) or src/App.tsx (Vite)
'use client';
import {
  SagtechUIProvider,
  ConfirmProvider,
  CommandPaletteProvider,
  Toaster,
} from '@sagtech-infra/ui';
import Link from 'next/link';
import Image from 'next/image';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SagtechUIProvider linkComponent={Link} imageComponent={Image}>
      <ConfirmProvider>
        <CommandPaletteProvider>
          {children}
          <Toaster position="top-right" />
        </CommandPaletteProvider>
      </ConfirmProvider>
    </SagtechUIProvider>
  );
}
```

For non-Next, omit `linkComponent` / `imageComponent` (the provider falls back to plain `<a>` and `<img>` shims). If the app already uses a router (`react-router-dom`), pass that router's `Link`:

```tsx
import { Link as RouterLink } from 'react-router-dom';
const RouterAdapter = ({ to, children, ...rest }: any) => <RouterLink to={to} {...rest}>{children}</RouterLink>;
<SagtechUIProvider linkComponent={RouterAdapter}>...</SagtechUIProvider>
```

### 7. Verify the install

```bash
pnpm install
pnpm typecheck   # should pass — sagtech-ui exports its own .d.ts
pnpm dev         # start the consumer app — bg should be #070715 (black_1) if tokens loaded correctly
```

If `pnpm typecheck` complains about `next/image` or `next/link` modules in non-Next consumers, alias them in the bundler — or rely on the `SagtechUIProvider` injection (preferred). For Vite:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({
  resolve: {
    alias: {
      'next/image': '@sagtech-infra/ui/dist/providers/DefaultImageShim',
      'next/link': '@sagtech-infra/ui/dist/providers/DefaultLinkShim',
      'next/dynamic': './src/shims/next-dynamic.tsx', // tiny shim that returns the dynamic'd module
    },
  },
});
```

(The provider approach in step 6 is preferred — aliases are a fallback.)

---

## Component catalog

Use the **right column** to decide what to import. If the entry says "(legacy)" or "(deprecated)", do not use it for new code.

### Foundations

| Component | What it is | Use when |
|---|---|---|
| `Typography` | Polymorphic text. `tag` = `h1..h4`/`p`/`span`/`label`; `type` = `BodyXL..BodyXS`/`Labels`/`LabelsS`/`Info`/`InfoBold`/`Buttons`/`ButtonsBold`/`MetricsTitle`/`MetricsXL`/`DisplayXL`/`DisplayL`/`SectionTitleL/M/S` | Any text. Replace native `<h1>`/`<p>` to get the right font + weight + line-height per token. |
| `Icon` | 150+ named icons via `<Icon icon="menu" size={20} color="#CDCDD0" />` | Any icon. Use `currentColor` (`color={tokens.colors.pr_purple}`) for theme-aware colors. |
| `Skeleton` + `SkeletonText` / `SkeletonAvatar` / `SkeletonCard` / `SkeletonTable` / `SkeletonList` | Loading placeholders | Use the preset that matches the loaded content. Drop into `if (loading) return <SkeletonCard />`. |
| `Divider` | Horizontal/vertical, `variant: 'solid' \| 'dashed'` | Visual separator between groups. |
| `KBD` | Keyboard-shortcut chip group: `<KBD keys={['Cmd', 'K']} size="sm" />` | Document hotkeys in tooltips, command lists, help pages. |

### Form controls

| Component | What it is | Use when |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'danger' \| 'tabButton' \| 'tabButtonWhite'`, `buttonSize: 'small' \| 'large' \| 'tabSize'`, `loadingType`, `disabled` | Any button. `variant="danger"` for destructive actions (delete, etc.). |
| `Input` | Text input with `state`/`isError`/`errorMessage`/`externalLabel` | Plain text/number/email/password. |
| `TextArea` | Multi-line input, same contract as `Input` | Multi-line free-form text. |
| `Checkbox` | Controlled, `label` rendered inside `<label>` | Boolean choice. |
| `Toggle` | `checked` + `onChange(boolean)`, sizes | On/off setting where toggle metaphor is right. |
| `RadioGroup` | `options` + `value` + `onChange` | Mutually-exclusive choice in a small fixed set. |
| `SegmentedControl` | iOS-style toggle group: `options`, `value`, `onChange`, sizes, `fullWidth` | Mutually-exclusive choice with chip aesthetic (view-mode toggle, time-range picker). |
| `SelectInput` | Native select with full keyboard nav, optional multi-select. `onSelect` is `@deprecated` — use `onChange`. | Short fixed list of options (≤ ~20). |
| `Combobox` | Searchable select, async-loading, custom render-per-option | Long lists, async-loaded options, free-typed search. |
| `SearchBar` | Debounced search input | Top-of-page search affordance. |
| `DatePicker` | Single date, optional `showTime` (hours+minutes, `timeStep` default 5) | Pick one date or one date+time. |
| `DateRangePicker` | `{ start, end }` range | Pick a date range. |
| `Dropzone` | Basic drag-and-drop, returns `File[]` via `onDrop` | CSV import, simple file pickup with no per-file tracking. |
| `FileDropzone` | Controlled `files: FileUploadItem[]`, per-file progress/status/retry, image preview, `maxFiles`/`maxSize` | Async upload with a progress bar per file. |
| `Attachment` | Inline paperclip-style single-file picker (legacy — `onUpload`, not `onChange`) | Existing forms expecting `multipart/form-data` with a single file. For new code, prefer `FileDropzone` with `maxFiles={1}`. |
| `PhoneInput` | International phone with auto-country-detection | Phone number input. |
| `TagInput` | Tag/chip editor (Enter or comma to add) | Tag editor (skills, keywords). |
| `DropdownMenu` | Trigger + items (danger, disabled, divider) with full keyboard nav | Action menus on a row, "more options" buttons. |
| `InlineEdit` | Click-to-edit. Enter/Esc to save/cancel; `multiline` with Cmd+Enter; `validate`, async `onSave` | Field on a detail page where edit ≠ a separate route. |
| `VariablePicker` | Modal with searchable + source-filtered list of template variables | Email-template / prompt-template editors. |
| `RichTextEditor` | TipTap wrapper with toolbar (bold/italic/strike/heading/list/quote/code/undo/redo). `extensions` prop for custom nodes. | Comment box, blog post body, anything that needs WYSIWYG. |
| `Form` + `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormError` / `FormHint` | `react-hook-form` wrappers — works with any input above | Any form with validation. Always prefer this over hand-rolled `<form>` + state. |

### Layout & overlays

| Component | What it is | Use when |
|---|---|---|
| `Modal` | Centered focused dialog. `isOpen` / `toggle`, `size: 'sm' \| 'md'`, `title` / `footer` slots, full a11y, focus-trap, stack-aware. New in v1.1: `ref` forwarding + `motionVariants` prop | Blocking dialog (forms, confirms, paywalls). |
| `Drawer` | Single side panel (`position: 'left' \| 'right'`) | Detail view, filter sidebar — single overlay only. |
| `Sheet` | Side panel that **stacks** with other sheets/modals via `ModalStack`. `open`/`onOpenChange`, `side: 'left'\|'right'\|'top'\|'bottom'`, sizes | Nested overlays (open detail panel from inside an open modal). |
| `BottomSheet` | Mobile-first bottom drawer with **drag-to-dismiss** + multi-snap-points | Mobile action sheets, filter sheets. |
| `ConfirmDialog` + `ConfirmProvider` + `useConfirm` + `useConfirmWithNote` | Imperative `await confirm({ … })` → `Promise<boolean>`. Note variant returns `{ confirmed, note }` | Any "are you sure?" flow. Don't roll your own. |
| `CommandPalette` + `CommandPaletteProvider` + `useRegisterCommand` | Cmd+K palette. Sub-tree commands register via the hook | Power-user navigation/shortcut launcher. |
| `Sidebar` | Desktop nav with `items`, `collapsed`, `header`/`footer` | App chrome left rail. |
| `CardWrapper` | Bordered container with gradient stroke + optional `href` (hover-lift, purple glow) | Tile/card on a dashboard or marketing page. |
| `Container` | Page centering, `size: 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Wrap page content for max-width. |
| `SectionTag` | Small badge-like section label | Section header pill. |
| `Breadcrumbs` | Crumb trail | Nested-route nav. |
| `CookieBanner` | Accept/Decline banner with local-cookie persistence. New in v1.1: `position` + `children?` slot | GDPR cookie consent — for cookies only. |
| `Popover` | Trigger + floating content, position + align, Esc closes, focus restored | Lightweight detail pop. |
| `Tooltip` | Hover/focus tooltip | Short hint. |
| `Wizard` + `useWizard` | Multi-step flow. Compound (`Wizard.Root` / `Progress` / `Content` / `Footer`) + hook for custom layouts | Onboarding, multi-step forms. |
| `Toolbar` (+ `ToolbarSeparator`) | Action bar — group of buttons with arrow-key roving focus, `role="toolbar"`, optional separators | Editor/canvas toolbar, multi-action header. |
| `FAB` | Floating action button anchored to viewport, optional `extended` pill, `loading` | Mobile primary action, "Compose"-style cross-page button. |

### Data display

| Component | What it is | Use when |
|---|---|---|
| `Table` | Simple `columns + data`, optional local sort | Static table, no sort/select/sticky needs. |
| `DataTable` | Controlled sort, selection (checkbox column), sticky header, loading skeleton, empty state | Any table with sortable columns or row selection. |
| `Badge` | `variant: 'filled' \| 'outlined' \| 'subtle'`, `color`, `size`, optional `dot` | Status pill, tag chip. |
| `Avatar` / `AvatarCard` | Picture + initials fallback. Card variant adds name + role | User chip, member list item. |
| `Tabs` | In-app tab navigation (controlled) | Section nav inside one page. |
| `InfoTabs` | Marketing tabs with icons + rich content panes | Landing-page "Features / Benefits / FAQ" only. Do **not** use as in-app nav. |
| `Timeline` | Swiper-based horizontal image timeline | Marketing timeline, history page. |
| `GanttTimeline` | Project Gantt: scale day/week/month, lane grouping, optional detail-modal via `renderItemDetail` | Project planning, schedule view. |
| `Steps` | Presentational stepper with animated progress line. **No per-step state** | Simple linear progress indicator. |
| `Stepper` | Per-step `status: 'pending'\|'active'\|'complete'\|'error'`, `description`, click-to-jump, horizontal/vertical | Steps that can fail or be revisited. |
| `Point` | Small dot + label marker | Map markers, key-value indicators. |
| `ResultPill` | Chip showing a labeled result (status + value) | Test result, KPI tile. |
| `Image` / `LazyImage` | `<img>` wrappers with shimmer placeholder + error fallback | Use over plain `<img>` for built-in placeholder/error handling. |
| `Pagination` | Compact paginator with next/prev + page-jump | Pagination for tables / lists. |
| `StatCard` | KPI card with label, value, trend indicator | Dashboard tiles. Pair with `SparklineChart` inside. |
| `Rate` | Read-only N-star rating | Display a rating. |
| `FaqDropdown` + `FaqList` | Accordion FAQ | FAQ pages. |
| `SortableList` | Drag-and-drop reorderable list on `@dnd-kit`. Vertical/horizontal/grid | User-reorderable list (board column, settings priorities). |
| `VirtualList` | Windowed list on `@tanstack/react-virtual` | Lists of 1000+ items where DOM weight matters. |
| `VisualGraphEditor` | ReactFlow wrapper — nodes/edges/handles/minimap/controls + `readOnly` | 2D editable graph (workflow editor, automation builder). |
| `CodeBlock` | Syntax-highlighted code (ts/tsx/js/jsx/json/bash/css/html built-in; Prism/Shiki via `highlight`). Copy button, line numbers, `maxHeight` | Display code in docs, debug panels. |

### Charts

All canvas-based unless noted. `width` accepts number or string (default 100% responsive); `height` is a number. Default 5-color palette uses `pr_purple` / `sec_purple` / `success` / `warning` / `sec_blue`.

| Component | Backed by | Best for |
|---|---|---|
| `LineChart` | Canvas | Time-series, multi-series line chart with hover. |
| `DonutChart` | SVG | Part-to-whole circular breakdown. |
| `AreaChart` | Native canvas | Smoothed trend with gradient fill (Catmull-Rom). Stackable. |
| `BarChart` | Native canvas | Vertical/horizontal bars; stacked or grouped. |
| `HeatmapChart` | Native canvas | Matrix of values (cohort retention, traffic by hour-of-day). |
| `RadarChart` | Native canvas | Multi-dimensional comparison (skill profile, feature parity). |
| `SparklineChart` | Native canvas | Tiny inline trend (default 80×24) inside `StatCard` or table cells. `tone: 'success' \| 'warning' \| 'error' \| 'neutral'`. |
| `ScatterChart` | Native canvas | XY points with optional bubble `size`. |
| `GaugeChart` | Native canvas | Half-circle speedometer with `min`/`max`/`thresholds`. |
| `SankeyChart` | Native canvas | Flow between stages (no `d3-sankey` peer needed). |
| `TreemapChart` | Native canvas | Squarified hierarchy where rectangle area = value. |
| `FunnelChart` | Native canvas | Conversion funnel (vertical or horizontal). |

### 3D / WebGL (optional)

These require optional peers (`three`, `@react-three/fiber`, `@react-three/drei`, plus `react-force-graph-3d` for Network3D). The peers are not bundled — install only if you import these components.

| Component | Backed by | Best for |
|---|---|---|
| `Network3D` | `react-force-graph-3d` | 3D force-directed view of connected entities — knowledge maps, dependency graphs. View-only (drag nodes, rotate camera). |
| `Globe3D` | `@react-three/fiber` + `@react-three/drei` | Interactive globe with raised lat/lng markers — geographic data. |
| `Scene3D` | `@react-three/fiber` (Canvas wrapper) | Generic 3D container — drop your own meshes inside. Comes with `OrbitControls` + default lighting. |
| `Mindmap3D` | `@react-three/fiber` + custom radial layout | Hierarchical mind map laid out in 3D space. |

### Feedback

| Component | What it is | Use when |
|---|---|---|
| `Alert` | Inline banner — `variant: 'info' \| 'success' \| 'warning' \| 'error'`, optional title/body/icon/action/close, optional `autoDismiss` ms | Inline status message in a layout. Stays in document flow. |
| `Banner` | Page-level sticky banner (`position: 'top' \| 'bottom'`), variants like `Alert` | System-status announcements, trial-expiring warnings, "you are viewing as another user". |
| `Spotlight` | Onboarding/feature highlight — clip-path-style cutout around a `targetRef` + tooltip card with optional Next/Skip + step counter | Product tours, "what's new" highlights. |
| `Toaster` + `toast` | Global toast API — `toast.success/error/info/warning/loading/promise`. Compact, auto-sized, stacks. | Transient feedback ("Saved", "Copied"). **Preferred** over `Notification`. |
| `NotificationCenter` | Bell icon + dropdown with notifications list, badge count, mark-as-read | Header bell with notification history. Prop-driven. |
| `EmptyState` | `variant: 'inline' \| 'card'` | Empty page or empty list-section. |
| `ProgressBar` | Determinate bar with variants + animation | Operation progress. |
| `AnimationButton` | Branded pill-style CTA with hover-expand (desktop only) | Hero/landing CTAs. |
| `SliderArrow` | Reusable nav arrow | Carousel/slider arrows. |
| `Notification` + `NotificationContext` + `NotificationContextProvider` + `NotificationWrapper` | **Legacy / `@deprecated` in v1.1.** Removal in v2.0. | Existing v1.0 code only. New code uses `Toaster` + `toast`. |

### Providers (wrap once at root)

- `SagtechUIProvider` — link/image component injection. Wrap the entire app.
- `ConfirmProvider` — required if you use `useConfirm` / `useConfirmWithNote`.
- `CommandPaletteProvider` — required if you use Cmd+K palette.
- `NotificationContextProvider` — `@deprecated`. Don't wire up for new apps.

### Hooks

- `useWindowSize`, `useDeviceType`, `useIntersectionObserver`, `useOutsideClick`, `useModals` — utility.
- `useStatusColor(status)` — maps `success/warning/error/info/neutral` to token colors.
- `useConfirm`, `useConfirmWithNote` — imperative confirms.
- `useCommandPalette`, `useRegisterCommand` — Cmd+K interaction.
- `useWizard` — multi-step flow.

### Utils

`getCurrencySymbol`, `formatSalary`, `calculateQuarters`, `formatDate`, `getCompanyAge`, `detectCountry` (+ `detectCountryByTimezone`/`detectCountryByLanguage`), `scrollToAnchor`, `hideDocumentScroll`, `getWindowScrollTop`, `validateEmail`, `validateLink`, `validatePhone`, `Portal`, `mergeRefs`.

### Icons

Separate entry point for raw icon SVG content:

```tsx
import { content as iconContent, type IAvailableIcons } from '@sagtech-infra/ui/icons';
```

Or render via the `<Icon>` component: `<Icon icon="menu" size={20} color="#CDCDD0" />`.

---

## Picker rules — which component for which job

Distilled from `docs/COMPONENT_PICKER.md`. When in doubt, follow these rules.

### Modal vs Drawer vs Sheet vs BottomSheet vs CommandPalette

- **Modal** — centered, blocking, must complete or dismiss (delete confirm, edit profile, paywall).
- **Drawer** — single side panel, no nesting (detail view, filter sidebar). Existing v1.0; keep using if it works.
- **Sheet** — side panel that **stacks** with other sheets/modals (open detail panel from inside open modal).
- **BottomSheet** — mobile bottom drawer with drag-to-dismiss + snap points.
- **CommandPalette** — Cmd+K global launcher. Not a substitute for any of the above.

### Toast vs Notification vs Alert vs Banner vs CookieBanner vs NotificationCenter

- **Toast** *(preferred)* — short-lived (2–5s) feedback, floating in corner, stacks. `toast.success("Saved")`.
- **Notification** — `@deprecated`. Existing code only.
- **Alert** — inline, persistent, in document flow. Errors under a form, rate-limit on a card.
- **Banner** — page-level, sticky, persistent, viewport-anchored. System announcements.
- **CookieBanner** — legal cookie consent only.
- **NotificationCenter** — header bell with history. Prop-driven.

### Stepper vs Steps vs Wizard

- **Steps** — purely visual progress indicator, no per-step state.
- **Stepper** — per-step `status` (pending/active/complete/error), descriptions, click-to-jump.
- **Wizard** — actual multi-step *flow* with state, navigation, validation. Wraps content. Use this for the form behavior; use Stepper inside for the visual.

### Network3D vs VisualGraphEditor

- **VisualGraphEditor** — 2D editable graph (xyflow). Drag-to-edit, custom node types, edge handles. The graph **is** the workflow product.
- **Network3D** — 3D force-directed view-only. Spatial exploration. Backed by `react-force-graph-3d`.

### Tabs vs InfoTabs

- **Tabs** — in-app navigation. Always.
- **InfoTabs** — marketing/landing only. Never in-app.

### DataTable vs Table

- **DataTable** — sort, selection, sticky header, loading state. Use for any non-trivial table.
- **Table** — purely static or read-only.

### Dropzone vs Attachment vs FileDropzone

- **Dropzone** — `onDrop(File[])`, no per-file UI. CSV import, simple drop-zone.
- **Attachment** — inline paperclip-style single file (legacy contract). Existing forms only.
- **FileDropzone** — async upload with per-file progress + retry. New code default.

### useConfirm vs useConfirmWithNote vs imperative Modal

- **useConfirm** — Yes/No.
- **useConfirmWithNote** — Yes/No + reason text input.
- **Modal** (built by hand) — anything more (multiple fields, validation, wizard).

### Charts decision

| Need | Use |
|---|---|
| Time-series line | `LineChart` or `AreaChart` (both canvas, no chart-engine peer) |
| Multiple lines stacked-area-style | `AreaChart` with `stacked={true}` |
| Bars (vertical/horizontal/stacked/grouped) | `BarChart` |
| Donut breakdown | `DonutChart` |
| KPI tile with sparkline | `StatCard` + `SparklineChart` inside |
| Cohort/retention/heatmap | `HeatmapChart` |
| Multi-dimensional comparison | `RadarChart` |
| XY scatter | `ScatterChart` |
| Speedometer KPI | `GaugeChart` |
| Flow between stages | `SankeyChart` |
| Squarified hierarchy | `TreemapChart` |
| Conversion funnel | `FunnelChart` |
| 3D force graph | `Network3D` |
| 3D globe with markers | `Globe3D` |
| Custom 3D scene | `Scene3D` |
| 3D mindmap | `Mindmap3D` |

---

## Style conventions

### Tokens

Every color and spacing must come from a token. The `@import '@sagtech-infra/ui/tokens'` brings them in as Tailwind v4 utilities AND CSS variables.

**Colors** (use as Tailwind classes `bg-X`, `text-X`, `border-X`, or as `tokens.colors.X`):

- Grayscale dark: `black_1` (#070715, body bg) → `black_2` → `black_3` → `black_4` (lightest dark)
- Grayscale light: `grey_1` → `grey_2` → `grey_3` → `grey_4` (text on dark)
- Whites: `white_1` → `white_4` (#F8F8F8, primary text), `white` (pure)
- Brand: `pr_purple` (#6D3EF1), `sec_purple` (#B69FF8), `pr_blue` (#292A94), `sec_blue` (#9494C9)
- Semantic: `success` (#58A61B), `warning` (#C6A328), `error` (#992D2D)

**Spacing** scale is named in pixels: `4px`, `6px`, `7px`, `8px`, `10px`, `11px`, `12px`, `15px`, `16px`, `20px`, `23px`, `24px`, `30px`, `32px`, `40px`, `48px`, `52px`, `56px`, `60px`, `62px`, `64px`, `72px`, `88px`, `117px`, `157px`. Use as `p-24px`, `gap-16px`, `mb-32px`. Also exposed as `tokens.spacing['16px']`.

**Z-index layers** (use as `var(--z-X)` in inline styles or `tokens.zIndex.X`):

- `--z-dropdown` = 1000
- `--z-popover` = 2000
- `--z-modal-backdrop` = 2999, `--z-modal` = 3000 (auto-bumped by ModalStack for nested modals)
- `--z-drawer-backdrop` = 4000, `--z-drawer` = 4001
- `--z-banner` = 4500 (new in v1.1)
- `--z-toast` = 5000
- `--z-tooltip` = 6000

**Radii**: `4px`, `6px`, `8px`, `10px`, `12px`, `16px`, `20px`, `24px`, `36px` — use as `rounded-X`.

**Fonts**: `font-manrope`, `font-orbitron`, `font-roboto` — use via Typography component or `font-X` classes.

### Typed token import

```tsx
import { tokens } from '@sagtech-infra/ui';
const purple = tokens.colors.pr_purple; // '#6D3EF1'
const gap = tokens.spacing['24px'];     // '24px'
const z = tokens.zIndex.modal;          // '3000'
```

### Callback naming

| Sceanrio | Use |
|---|---|
| Controlled value change | `onChange(next: T)` (or native `ChangeEventHandler`) |
| Item selected with menu close | `onSelect(item: T)` |
| Click | `onClick` |
| Open/close overlay | `onOpenChange(open: boolean)` |
| Close-only | `onClose()` |
| Confirm with optional async block | `onConfirm: () => void \| Promise<void>` |
| Reorder collection | `onReorder(nextItems: T[])` |
| Wizard complete | `onComplete()` |
| Drop files (one-shot) | `onDrop(files: File[])` |

### Other rules

- `'use client'` at the top of any interactive component (overlays, forms, toasts) when used with the Next.js App Router.
- forwardRef the root DOM element for interactive primitives — react-hook-form's `register().ref` and floating-ui both rely on it.
- Compound components import as a group: `Form` + `FormField` + `FormControl` + `FormError`; `Toolbar` + `ToolbarSeparator`.
- Booleans: `disabled`, `loading`, `required`, `error: boolean`. Text errors: `errorMessage: string`.
- Sizes: `size?: 'sm' | 'md' | 'lg'` (add `'xl'`/`'full'` only when truly needed).
- Variants: semantic (`primary` / `secondary` / `danger`), never color-named (`'purple'`).

---

## Migration workflow

Run these phases in order. After each phase, run `pnpm typecheck && pnpm test` (and `pnpm dev` to spot-check). Get human approval before moving to the next phase.

### Phase 0 — Inventory

Read the consumer codebase. Produce a structured report:

1. **Current UI dependencies** — every package in `package.json` that ships UI components (shadcn-ui, @mui/*, @chakra-ui/*, antd, mantine, react-bootstrap, headlessui, @radix-ui/*, react-hot-toast, sonner, recharts, chart.js, @nivo/*, react-flow, react-table, ag-grid, etc.). For each, list the components actually used (grep imports).
2. **Custom components** — locally-defined components that look like UI primitives (`<MyButton>`, `<MyModal>`, `<MyTable>`). For each, summarize props + behavior in 1-2 lines.
3. **Theming** — does the app have a light/dark toggle? a custom Tailwind config? hardcoded hex colors? List files with the most.
4. **Forms** — uses `react-hook-form`? formik? plain controlled state? List representative form files.
5. **Charts** — what chart library, what chart types, where rendered.

Output the report as a numbered list. Wait for the human's go.

### Phase 1 — Setup

Apply the **Setup checklist** above. Land:

- Install `@sagtech-infra/ui` + required peers.
- Configure `.npmrc` if needed.
- Tokens import.
- Fonts wired.
- `<SagtechUIProvider>` + any imperative providers at the app root.
- `<Toaster />` mounted.

Verify `pnpm dev` shows the page with `bg-black_1` body. **Stop. Get approval.**

### Phase 2 — Foundations + Form Controls

Replace the Phase 0 inventory items in this order:

1. **`Button`** — every custom/shadcn button. Map `variant="destructive"` → `variant="danger"`, sizes by closest match (`small`/`large`/`tabSize`).
2. **`Input` / `TextArea` / `Checkbox` / `Toggle` / `RadioGroup`** — straight swap. Watch for `errorMessage` instead of separate error text divs.
3. **`SelectInput` / `Combobox`** — pick by list size. Migrate `onSelect` (deprecated in SelectInput) → `onChange`.
4. **`SegmentedControl`** — for in-app view-mode toggles currently rendered as a custom radio.
5. **`Form` family** — convert react-hook-form usage. Each `<input>` becomes `<FormField name="x" render={({ field }) => <Input {...field} />} />`.
6. **`Typography`** — replace custom heading/text components.
7. **`Icon`** — replace lucide-react / @heroicons / custom svg sprites where the icon name is in the sagtech-ui catalog. For icons not in the catalog, keep them inline but use `tokens.colors.X` for stroke/fill.

Run `pnpm typecheck && pnpm test`. **Stop. Get approval.**

### Phase 3 — Layout & Overlays

1. **`Modal`** — replace HeadlessUI `<Dialog>`, radix `<Dialog.Root>`, MUI `<Dialog>`, custom modals.
2. **`Drawer` / `Sheet` / `BottomSheet`** — pick per the picker rules.
3. **`useConfirm`** — replace `window.confirm()`, custom confirm modals, sweetalert. `useConfirmWithNote` for ones requiring a reason.
4. **`Toaster` + `toast.X`** — replace react-hot-toast, sonner, react-toastify.
5. **`CommandPalette`** — replace cmdk, kbar.
6. **`Container` / `Sidebar` / `Breadcrumbs`** — page chrome.
7. **`Tabs`** (in-app) — replace custom tabs.
8. **`Popover` / `Tooltip`** — replace radix popover, MUI tooltip, etc.
9. **`Wizard`** — replace any multi-step form state machines.

Run `pnpm typecheck && pnpm test`. **Stop. Get approval.**

### Phase 4 — Data display

1. **`DataTable`** — replace TanStack Table / ag-grid / MUI DataGrid for any table with sort or selection. `Table` for static.
2. **`Pagination`** — replace custom paginators.
3. **`Avatar` / `AvatarCard`**, **`Badge`**, **`Tabs`**, **`StatCard`** — straight swaps.
4. **`SortableList`** — replace `react-beautiful-dnd` / custom dnd lists where reorder is the affordance.
5. **`VirtualList`** — for long lists (1000+ items).
6. **`Stepper`** / **`Steps`** — replace MUI Stepper, custom step indicators.

Run `pnpm typecheck && pnpm test`. **Stop. Get approval.**

### Phase 5 — Charts

For each existing chart:

- Time-series line → `LineChart` or `AreaChart` (both canvas, no chart-engine peer needed).
- Bar → `BarChart`.
- Donut → `DonutChart`.
- Heatmap → `HeatmapChart`.
- Sparklines in tiles → `SparklineChart`.
- Funnel/Sankey/Treemap → `FunnelChart` / `SankeyChart` / `TreemapChart`.

Use the default 5-color palette unless brand color rules say otherwise. Pull explicit colors from `tokens.colors`.

Run `pnpm typecheck && pnpm test`. **Stop. Get approval.**

### Phase 6 — 3D (only if relevant)

Install the four optional peers, add components that fit (`Network3D` / `Globe3D` / `Scene3D` / `Mindmap3D`).

### Phase 7 — Sweep

- Remove `package.json` entries: `shadcn-ui`, `@mui/*`, `@chakra-ui/*`, `antd`, `mantine`, `react-bootstrap`, `headlessui`, `@radix-ui/*`, `react-hot-toast`, `sonner`, `react-toastify`, `recharts`, `chart.js`, `@nivo/*` — anything no longer imported. Run `pnpm install`.
- Remove leftover wrapper components in the consumer repo that simply re-export the above.
- Grep for hardcoded hex (`#[0-9A-Fa-f]{3,8}`) and px (`\b\d{1,3}px\b` outside layout-critical contexts). Convert to tokens.
- Remove any light/dark theme toggle. Set `<html data-theme="dark">` (or remove the attribute) and standardize on the dark palette.
- Don't pin optional peers you don't use. If no rich-text editing, don't install `@tiptap/*`. If no 3D, don't install `three` / `@react-three/*`. The point of optional peers is paying only for what you import.

Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build`. Final spot-check via `pnpm dev`. Report summary. **Stop. Get approval to merge.**

---

## Worked examples

### Example 1 — Button (shadcn → sagtech)

**Before:**

```tsx
import { Button } from '@/components/ui/button';
<Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
```

**After:**

```tsx
import { Button } from '@sagtech-infra/ui';
<Button text="Delete" variant="danger" buttonSize="small" onClick={onDelete} />
```

Note: sagtech `Button` takes `text` prop (or `children` works too in most variants). Map shadcn variants:
- `default` → `primary`
- `destructive` → `danger`
- `outline` / `secondary` → `secondary`
- `ghost` / `link` → use `<Typography tag="span" type="ButtonsBold">` with `onClick` (or a custom inline element with `text-pr_purple`)

### Example 2 — Form (custom RHF → sagtech `Form`)

**Before:**

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<Values>();
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <label>Email</label>
    <input {...register('email', { required: true })} />
    {errors.email && <span className="text-red-500">Required</span>}
    <button type="submit">Submit</button>
  </form>
);
```

**After:**

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormError, Input, Button } from '@sagtech-infra/ui';
import { useForm } from 'react-hook-form';

const form = useForm<Values>();
return (
  <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
    <FormField name="email" rules={{ required: 'Required' }} render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormError />
      </FormItem>
    )} />
    <Button text="Submit" variant="primary" buttonSize="large" type="submit" />
  </Form>
);
```

### Example 3 — Modal (HeadlessUI → sagtech `Modal`)

**Before:**

```tsx
import { Dialog } from '@headlessui/react';
<Dialog open={open} onClose={() => setOpen(false)}>
  <Dialog.Panel>
    <Dialog.Title>Edit profile</Dialog.Title>
    <form>{/* ... */}</form>
    <button onClick={() => setOpen(false)}>Cancel</button>
  </Dialog.Panel>
</Dialog>
```

**After:**

```tsx
import { Modal, Button } from '@sagtech-infra/ui';
<Modal
  isOpen={open}
  toggle={() => setOpen(false)}
  size="md"
  title="Edit profile"
  footer={<Button text="Cancel" variant="secondary" onClick={() => setOpen(false)} />}
>
  <form>{/* ... */}</form>
</Modal>
```

The `Modal` ships with focus-trap, focus-restore, Escape handling, and stack-aware z-index — none of which the manual HeadlessUI version provides without extra wiring.

### Example 4 — Confirmation flow

**Before:**

```tsx
const [confirmOpen, setConfirmOpen] = useState(false);
// ... custom modal, custom callback wiring ...
```

**After:**

```tsx
// app root, once:
import { ConfirmProvider } from '@sagtech-infra/ui';
<ConfirmProvider><App /></ConfirmProvider>

// at the call site:
import { useConfirm, toast } from '@sagtech-infra/ui';
const confirm = useConfirm();
const handleDelete = async () => {
  const ok = await confirm({
    title: 'Delete this item?',
    description: 'This action cannot be undone.',
    variant: 'danger',
    confirmText: 'Delete',
  });
  if (ok) {
    await api.delete();
    toast.success('Deleted');
  }
};
```

### Example 5 — Toasts (react-hot-toast / sonner → sagtech `toast`)

**Before:**

```tsx
import toast from 'react-hot-toast';
toast.success('Saved');
toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Failed' });
```

**After:**

```tsx
import { toast } from '@sagtech-infra/ui';
toast.success('Saved');
toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Failed' });
// also: toast.error, toast.info, toast.warning, toast.loading, toast({ title, description, action })
```

Mount `<Toaster position="top-right" />` once near the app root — already in the Setup section above.

### Example 6 — Table (TanStack → sagtech `DataTable`)

**Before:**

```tsx
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';
// ~80 lines of column defs + table render setup
```

**After:**

```tsx
import { DataTable, type DataTableColumn } from '@sagtech-infra/ui';

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'lastSeen', header: 'Last seen', sortable: true, cell: (r) => formatDate(r.lastSeen) },
];

<DataTable
  columns={columns}
  data={rows}
  loading={isLoading}
  selection={{ value: selectedIds, onChange: setSelectedIds, getRowId: (r) => r.id }}
  sort={{ value: sortState, onChange: setSortState }}
/>
```

### Example 7 — Charts

**Before** (recharts):

```tsx
import { LineChart as RC, Line, XAxis, YAxis, Tooltip } from 'recharts';
<RC width={600} height={300} data={data}>
  <Line dataKey="value" stroke="#8884d8" />
  <XAxis dataKey="date" /><YAxis /><Tooltip />
</RC>
```

**After:**

```tsx
import { AreaChart, type AreaChartSeries } from '@sagtech-infra/ui';
const series: AreaChartSeries[] = [
  { name: 'Visits', data: data.map((d) => ({ x: d.date, y: d.value })) },
];
<AreaChart series={series} width="100%" height={300} gradient />
```

For donut → `DonutChart`, for bars → `BarChart`. Pull colors from `tokens.colors` if you want explicit overrides; otherwise the default 5-color palette is wired.

### Example 8 — Page layout (Sidebar + Container + Breadcrumbs + Toaster)

```tsx
import { Sidebar, Container, Breadcrumbs, Toaster } from '@sagtech-infra/ui';

export default function AppLayout({ children, crumbs }: { children: React.ReactNode; crumbs: { label: string; href?: string }[] }) {
  return (
    <div className="flex min-h-screen bg-black_1">
      <Sidebar
        items={[
          { label: 'Dashboard', icon: 'home', href: '/' },
          { label: 'Projects', icon: 'document', href: '/projects' },
          { label: 'Team', icon: 'users', href: '/team' },
          { label: 'Settings', icon: 'settings', href: '/settings' },
        ]}
      />
      <main className="flex-1 p-32px">
        <Breadcrumbs items={crumbs} />
        <Container size="lg">{children}</Container>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
```

---

## Anti-patterns — explicit "do not"

1. **Don't install or keep** `@radix-ui/*`, `@headlessui/react`, `@mui/material`, `@chakra-ui/react`, `antd`, `mantine`, `react-bootstrap`, `react-hot-toast`, `sonner`, `react-toastify`, `recharts`, `chart.js`, `@nivo/*`, `cmdk`, `kbar` if a sagtech-ui equivalent exists.
2. **Don't deep-import** `@sagtech-infra/ui/dist/components/Foo/Foo`. Always `from '@sagtech-infra/ui'`.
3. **Don't hardcode** hex (`#070715`) or px (`24px`) — use `bg-black_1` and `p-24px` (Tailwind utilities) or `tokens.colors.black_1` and `tokens.spacing['24px']` (TS constants).
4. **Don't add a light theme.** Dark-mode-only is intentional. Strip any `data-theme` toggles that pivot the palette. (You may keep a "dark / system" UI toggle if it does nothing — but better to delete it.)
5. **Don't use `Notification`** for new code (`@deprecated` in v1.1, removal in v2.0). Use `Toaster` + `toast`.
6. **Don't render 3D components on the server.** Add `'use client'` at the top of files that import `Network3D` / `Globe3D` / `Scene3D` / `Mindmap3D`. Or wrap them in `next/dynamic({ ssr: false })`.
7. **Don't pin optional peers you don't use.** If no rich-text editing, don't install `@tiptap/*`. If no 3D, don't install `three` / `@react-three/*`. The point of optional peers is paying only for what you import.
8. **Don't change product behavior** during the migration. If the existing modal closes on backdrop-click, the replacement should too. Surface unintended differences to the human as findings, not silently "improvements."
9. **Don't wrap every primitive in a one-line consumer wrapper** ("just to add our class"). The library tokens already cover the brand. Wrappers proliferate and obscure the source.
10. **Don't leave `console.warn` calls** about missing peer dependencies. If a 3D component prints "install three to use Network3D", install three (or remove the import). Don't ship the warning.

---

## Verification checklist

The migration is **done** when all of these are true:

- [ ] `pnpm install` completes without `404`/`401` from the GitHub Packages registry.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes (no new warnings).
- [ ] `pnpm test` passes.
- [ ] `pnpm dev` renders the app; body bg is `#070715` (`tokens.colors.black_1`).
- [ ] No imports remain from: shadcn/ui, `@mui/*`, `@chakra-ui/*`, `antd`, `mantine`, `react-bootstrap`, HeadlessUI, `@radix-ui/*`, `react-hot-toast`, `sonner`, `react-toastify`, `recharts`, `chart.js`, `@nivo/*`, `cmdk`, `kbar`.
- [ ] `package.json` `dependencies` no longer lists those packages (`pnpm install` removed them from lock).
- [ ] No hardcoded hex colors outside icon-data files. (Run `grep -rE "#[0-9A-Fa-f]{3,8}" src/ --include="*.tsx" --include="*.ts" --include="*.css"`.)
- [ ] All overlays render at correct z-index — no fight with page elements at unrelated z-indexes.
- [ ] No light-mode theme toggle remains.
- [ ] All new code uses `Toaster` + `toast` for transient feedback (no `Notification` in new code).
- [ ] Every existing screen still works — no broken interactions, no console errors.

Run a final smoke pass: navigate every primary route in the app, open every modal, submit one form, trigger one toast, paginate one table.

---

## Pointers — read these inside `node_modules/@sagtech-infra/ui/`

If the assistant has filesystem access in the consumer repo, it can read the live docs that ship with the package:

- `node_modules/@sagtech-infra/ui/README.md` — full component overview + install steps + quick-start.
- `node_modules/@sagtech-infra/ui/docs/COMPONENT_PICKER.md` — picker tables (canonical source for the rules above).
- `node_modules/@sagtech-infra/ui/docs/API_CONVENTIONS.md` — callback naming, prop shape, ref-forwarding rules (canonical).
- `node_modules/@sagtech-infra/ui/docs/MIGRATION.md` — version-to-version breaking changes (currently 1.0 → 1.1 zero-breaking, with deprecation notes).
- `node_modules/@sagtech-infra/ui/docs/ROADMAP.md` — what's done + what's planned. Useful when deciding whether to wait for an upstream fix or build locally.
- `node_modules/@sagtech-infra/ui/CLAUDE.md` — agent-readable architecture overview of the library itself.

If those files are not in `node_modules` (some installers strip them), fetch from GitHub: `https://github.com/SagTech-infra/sagtech-ui/tree/main/docs`.

---

## When you're stuck

1. **A component you need doesn't exist.** Build it locally in the consumer repo using sagtech-ui tokens + Tailwind utilities + framer-motion (the library's animation peer). Match the API conventions in the table above. Flag it to the human at the end so they can upstream.
2. **A peer-dep mismatch warns at install.** That's expected for optional peers (e.g. `@react-three/fiber@8` warns about React 18 even though it works on 19). Note it; don't try to "fix" by downgrading the consumer's React.
3. **A behavior change is unavoidable.** Surface it explicitly: "This sagtech component closes on backdrop click; the previous modal did not. Want me to add `disableBackdropClick` semantics, or accept the new behavior?"
4. **The consumer is on Tailwind v3.** Stop migration. Tailwind v4 is a prerequisite (the library uses `@theme` tokens). Plan a Tailwind upgrade as a separate task before resuming.
5. **The consumer is on React 18.** Same — React 19 is a hard prerequisite. Upgrade first.
6. **Authentication / `NODE_AUTH_TOKEN` is missing.** Tell the human. Never ask for the token in chat or paste it into code.

---

## End

That's everything. Plan in phases, work cluster by cluster, run typecheck + tests between each phase, and surface findings at the end. The library is dark-mode-only and additive-by-default — your migration should preserve product behavior while replacing the component surface end to end.

— *Generated for `@sagtech-infra/ui@1.1.0` (May 2026). If the version on the consumer's `node_modules` is newer, prefer the README/docs that ship with that version.*
