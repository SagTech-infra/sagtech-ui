# Theming

`@sagtech-infra/ui` ships a dark-first design. Light theme is opt-in via `ThemeProvider`.

> For locale-aware dates and right-to-left (RTL) layout, see [I18N.md](./I18N.md).

---

## 1. Import tokens

Add this at the top of your global stylesheet — before any component styles:

```css
@import '@sagtech-infra/ui/tokens';
```

This imports `theme.css` (the `@theme` block + `[data-theme="light"]` overrides),
`gradients.css`, `animations.css`, `autofill.css`, and `scrollbar.css`.

Dark mode is the default — no extra opt-in is needed for a pure dark app.

---

## 2. ThemeProvider

Wrap your app (or a subtree) with `ThemeProvider`. It writes `data-theme` and
`color-scheme` to the target element.

### Uncontrolled (persisted to localStorage)

```tsx
import { ThemeProvider } from '@sagtech-infra/ui';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="my-app-theme">
      <YourApp />
    </ThemeProvider>
  );
}
```

The current selection is hydrated from `localStorage` on mount and written back
on every change. `defaultTheme` defaults to `"dark"`.

### Controlled

```tsx
const [theme, setTheme] = useState<Theme>('dark');

<ThemeProvider theme={theme} onThemeChange={setTheme}>
  <YourApp />
</ThemeProvider>
```

When `theme` is set, localStorage persistence is disabled — the prop wins.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `"dark" \| "light" \| "system"` | — | Controlled theme. Disables persistence. |
| `defaultTheme` | `"dark" \| "light" \| "system"` | `"dark"` | Uncontrolled initial theme. |
| `onThemeChange` | `(theme: Theme) => void` | — | Called on every theme change. |
| `target` | `"html" \| "body"` | `"html"` | Element that receives `data-theme` + `color-scheme`. |
| `storageKey` | `string` | `"sagtech-ui-theme"` | localStorage key (uncontrolled only). |
| `enableSystem` | `boolean` | `true` | When `false`, `"system"` falls back to `"dark"`. |

### Portal-rendered overlays and `target`

Modal, Drawer, Toast, and Popover render into `document.body` via a portal.
Setting `target="html"` (the default) ensures the `data-theme` attribute sits on
`<html>`, so custom properties are inherited by `<body>` and every portal subtree.

With `target="body"`, portal children rendered *outside* `<body>`'s subtree will
fall back to the dark defaults. Prefer `"html"` unless you have a specific reason
to scope the theme to `<body>`.

---

## 3. Via `SagtechUIProvider`

If you already use `SagtechUIProvider` for `imageComponent`/`linkComponent`, pass
theme props there to avoid a nested provider:

```tsx
<SagtechUIProvider defaultTheme="dark" themeTarget="html">
  <YourApp />
</SagtechUIProvider>
```

`SagtechUIProvider` wraps a `ThemeProvider` only when `theme` or `defaultTheme`
is provided; otherwise it skips the wrapper entirely.

| Prop | Maps to |
|---|---|
| `theme` | `ThemeProvider.theme` |
| `defaultTheme` | `ThemeProvider.defaultTheme` |
| `themeTarget` | `ThemeProvider.target` |

---

## 4. `<ThemeScript />` — prevent FOUC on SSR

Without a blocking script, a server-rendered page briefly renders in dark before
the React tree mounts and reads localStorage. `ThemeScript` emits a tiny inline
script that sets `data-theme` synchronously during HTML parsing.

Place it in `<head>` before any stylesheets that reference semantic tokens:

```tsx
// app/layout.tsx (Next.js App Router)
import { ThemeScript } from '@sagtech-infra/ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeScript storageKey="my-app-theme" defaultTheme="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Match `storageKey` and `defaultTheme` to the values passed to `ThemeProvider`.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `storageKey` | `string` | `"sagtech-ui-theme"` | Must match `ThemeProvider.storageKey`. |
| `defaultTheme` | `"dark" \| "light" \| "system"` | `"dark"` | Fallback when nothing is in localStorage. |
| `target` | `"html" \| "body"` | `"html"` | Must match `ThemeProvider.target`. |

---

## 5. `useTheme()`

Returns `{ theme, resolvedTheme, setTheme }`.

- `theme` — the selected value; stays `"system"` when system mode is active.
- `resolvedTheme` — the effective `"dark"` or `"light"` after resolving `"system"` via `matchMedia`.
- `setTheme` — updates the theme (and persists if uncontrolled).

```tsx
import { useTheme } from '@sagtech-infra/ui';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      {resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}
```

---

## 6. Semantic tokens

New components should use semantic utility classes instead of raw palette classes.
Semantic tokens flip automatically between dark and light — no per-component
light-mode overrides needed.

### Backgrounds

| Utility class | Dark | Light | Use for |
|---|---|---|---|
| `bg-bg-primary` | `#070715` | `#f7f7fa` | Page / root background |
| `bg-bg-secondary` | `#1b1b27` | `#ffffff` | Cards, sidebars, panels |
| `bg-bg-tertiary` | `#393944` | `#e6e6e8` | Hover states, dividers |
| `bg-surface-overlay` | `#20202d` | `#ffffff` | Dropdowns, popovers, tooltips |

### Foregrounds

| Utility class | Dark | Light | Use for |
|---|---|---|---|
| `text-fg-primary` | `#f8f8f8` | `#070715` | Body text, headings |
| `text-fg-secondary` | `#cdcdd0` | `#393944` | Secondary text |
| `text-fg-muted` | `#83838a` | `#51515b` | Placeholders, captions, disabled |

### Borders

| Utility class | Dark | Light | Use for |
|---|---|---|---|
| `border-border-default` | `#393944` | `#d8d8dc` | Default dividers and outlines |
| `border-border-strong` | `#5c5c66` | `#8f8f94` | Emphasized borders, focus rings |

### Status foregrounds

| Utility class | Use for |
|---|---|
| `text-fg-success` | Success text / icons |
| `text-fg-warning` | Warning text / icons |
| `text-fg-error` | Error text / icons |
| `text-fg-info` | Informational text / icons |

### Status backgrounds

| Utility class | Use for |
|---|---|
| `bg-bg-success` | Success badge / alert background |
| `bg-bg-warning` | Warning badge / alert background |
| `bg-bg-error` | Error badge / alert background |
| `bg-bg-info` | Info badge / alert background |

---

## 7. Hybrid model — raw palette classes

Existing code uses raw palette classes like `bg-black_1`, `text-white_2`, and
`border-grey_3`. These still flip in light mode because the `[data-theme="light"]`
block in `theme.css` overrides the raw scale:

```
dark: --color-black_1 = #070715   → bg-black_1 is very dark
light: --color-black_1 = #f7f7fa  → bg-black_1 is very light
```

This means most existing components render sensibly in light without any changes.

**Caveat:** a raw color used *literally* — not semantically — may flip
unexpectedly. For example, a badge that hardcodes `bg-white_4` intending a
near-white background will become near-black in light because `white_4` maps
to `#070715` in light mode. Migrate such cases either to a non-themed raw value
(inline style or a one-off CSS variable) or to the appropriate semantic token.

**New code should always prefer semantic tokens.** The raw-scale override exists
for backwards compatibility, not as a recommended pattern.

---

## 8. Cascade details

Light overrides use a dual selector for specificity robustness:

```css
:root[data-theme="light"],
[data-theme="light"] {
  --color-bg-primary: #f7f7fa;
  /* ... */
}
```

- `:root[data-theme="light"]` (specificity 0-2-0) beats `@theme`'s `:root` (0-1-0)
  when the attribute is on `<html>` (default `target`).
- `[data-theme="light"]` covers `target="body"` via custom-property inheritance
  proximity: `<body>` is a closer ancestor for its subtree than `<html>`.

---

## 9. Charts and theming

The canvas charts (`AreaChart`, `BarChart`, `HeatmapChart`, `RadarChart`,
`SparklineChart`, `ScatterChart`, `GaugeChart`, `SankeyChart`, `TreemapChart`,
`FunnelChart`, plus `LineChart`/`DonutChart`) draw to a `<canvas>`, so they can't
use Tailwind utility classes for color. Instead they read their palette from the
same CSS custom properties as the rest of the library, at render time, via the
`useThemeColors` hook.

- **Theme-aware at draw time.** On each draw the chart resolves its palette from
  the CSS custom properties on the document (the values that the active
  `data-theme` resolves to via the cascade in §8). Switching the theme flips the
  chart colors with everything else — no per-chart `theme` prop needed.
- **Repaints on theme change.** `useThemeColors` observes the active theme
  (`data-theme` on the target element) and triggers a repaint when it changes, so
  a `ThemeProvider`/`setTheme` toggle re-colors live charts without remounting.
- **Static fallback.** When CSS custom properties aren't resolvable — SSR, the
  first paint before hydration, or tests without a real CSSOM — the hook falls
  back to the static token palette (the same values exported as `tokens.colors`),
  so charts still render with sensible colors instead of blank/transparent fills.
- **Localized numeric labels.** Axis ticks and value labels are formatted with
  `Intl.NumberFormat`, using the locale from `useLocale()` (see [I18N.md](./I18N.md)),
  so thousands separators and decimals match the consumer's locale.

`useThemeColors` is exported from the package root, so consumers building their
own canvas/SVG renderers can reuse the same theme-aware palette resolution.
