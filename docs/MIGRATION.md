# Migration notes

## Package name — `@sagtech-infra/ui` (final)

Пакет опубликован в GitHub Packages как **`@sagtech-infra/ui`**. Некоторые потребители исторически импортируют его как `@sagtech/ui` через локальный `file:`-alias в их `package.json` / `tsconfig.json`. **Для новых проектов используйте официальное имя.**

Существующим потребителям (`admin-fe`, `customer-fe`, `posting-hub`, `lead-gen-tool/fe-next`, `smg-frontend-new`, `landing-*`):

- Пока проект установлен через `file:../sagtech-ui` или `workspace:*` — alias `@sagtech/ui` работает.
- При первом публичном релизе (bump до `1.0.0`+ и публикация на `npm.pkg.github.com`) потребителям нужно:

```diff
 // package.json
 "dependencies": {
-  "@sagtech/ui": "file:../sagtech-ui"
+  "@sagtech-infra/ui": "^1.0.0"
 }
```

и глобальный search-and-replace `@sagtech/ui` → `@sagtech-infra/ui` в импортах. Alternatively, keep `@sagtech/ui` as `tsconfig.json paths` alias to the real `@sagtech-infra/ui` package:

```json
{
  "compilerOptions": {
    "paths": {
      "@sagtech/ui": ["./node_modules/@sagtech-infra/ui"],
      "@sagtech/ui/icons": ["./node_modules/@sagtech-infra/ui/icons"]
    }
  }
}
```

Второй вариант проще для миграции (одна правка в tsconfig), но тянет за собой alias навсегда. Длительная перспектива — переход на официальное имя.

## Breaking changes

### 1.0.0 (upcoming)

- `Modal`: убран `isPartnershipForm: boolean` → заменён на `size: 'sm' | 'md'`. Миграция: `isPartnershipForm` → `size="md"`; отсутствие → `size="sm"` (default).
- `TextArea`: убран `export default TextArea`. Импортируйте named: `import { TextArea } from '@sagtech-infra/ui'`.
- `Button`: добавлен `variant="danger"`. Существующий workaround `classes="!text-error !border-error"` следует удалить.
- `Attachment.accept`: тип расширен с literal-union до `string`. Старый cast `as never` можно удалять.
- `SelectInput`: `onSelect` помечен `@deprecated`, используйте `onChange`. Оба всё ещё работают.
- `Typography`: `tag` теперь принимает `'label'` + добавлен `htmlFor`. Локальные `FieldLabel`-клоны можно заменить на `<Typography tag="label" htmlFor={...} type="LabelsS">…</Typography>`.
- `NotificationContextProvider`: теперь экспортируется из root. Локальные провайдеры можно удалять.
- `ConfirmDialog` + `useConfirm`: `variant="danger"` теперь использует нативный `Button variant="danger"` (раньше `!important`-override). Визуально эквивалентно, но внутренний CSS отличается — проверьте кастомизации classes.

### Новые peer-dependencies (все optional)

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — для `SortableList`
- `@tanstack/react-virtual` — для `VirtualList`
- `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit` — для `RichTextEditor`
- `@xyflow/react` — для `VisualGraphEditor`

Устанавливайте только если используете соответствующий компонент.

### 1.0 → 1.1

**Zero breaking changes.** Drop-in upgrade from `1.0.x` — all existing imports, props, and runtime behavior continue to work unchanged.

**New optional peer-deps for 3D components.** Install ONLY if you render the corresponding components:

| Peer                                                                       | Required by                       |
| -------------------------------------------------------------------------- | --------------------------------- |
| `three`, `@react-three/fiber`, `@react-three/drei`                         | `Globe3D`, `Scene3D`, `Mindmap3D` |
| `three`, `@react-three/fiber`, `@react-three/drei`, `react-force-graph-3d` | `Network3D`                       |

```bash
# Only if you use a 3D component
pnpm add three @react-three/fiber @react-three/drei
# And for Network3D specifically:
pnpm add react-force-graph-3d
```

If you don't import any of the four 3D components, you don't need any new peer.

**`Notification` family deprecated (warn-only, no runtime change).**

`Notification`, `NotificationWrapper`, `NotificationContext`, `NotificationContextProvider` now carry `@deprecated` JSDoc pointing at `Toast`. Existing imports still work and behave identically — only IDE/TS surfacing changes. Migrate to `Toast` (`Toaster` + imperative `toast.success()` / `toast.error()` / `toast.promise()`) at your convenience. Removal is scheduled for **v2.0**.

**Additive prop additions (zero migration needed):**

- `Modal` now `forwardRef`s to its root container, and accepts an optional `motionVariants?: ModalMotionVariants` prop.
- `Alert.autoDismiss?: number` (ms) — when set, fires `onClose` after the timeout.
- `ConfirmDialog.confirmDisabled?: boolean` — disables the primary action without affecting cancel.
- `CookieBanner.position?: 'top' \| 'bottom'` (default `'bottom'`) and a `children?` slot for custom content. Existing `title`/`description` continue to work.

### 1.2 → 1.3

**Zero breaking changes.** Drop-in upgrade from `1.2.x` — all existing imports, props, and runtime behavior continue to work unchanged.

**Accessibility — major wins:**

- `Tabs` — new compound API alongside the existing `items`-prop facade:
  ```tsx
  <Tabs.Root value={tab} onValueChange={setTab}>
    <Tabs.List aria-label="Sections">
      <Tabs.Trigger value="a">A</Tabs.Trigger>
      <Tabs.Trigger value="b">B</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="a">…</Tabs.Content>
    <Tabs.Content value="b">…</Tabs.Content>
  </Tabs.Root>
  ```
  Full ARIA (`role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`, `aria-orientation`), roving tabindex, arrow-key / Home / End / Enter / Space navigation, `orientation="horizontal"|"vertical"`, `activationMode="automatic"|"manual"`, `lazyMount?: boolean` (default `true`). The existing `<Tabs items={…} defaultIndex={…} onChange={…} />` keeps working unchanged. `defaultIndex` carries `@deprecated` JSDoc pointing at `defaultValue`; removal scheduled for **v2.0**.
- `Modal`, `Drawer`, `ConfirmDialog` — new `initialFocusTarget?: string | HTMLElement | RefObject<HTMLElement> | null` prop. `string` is a CSS selector resolved inside the overlay; `HTMLElement` / `RefObject` focus directly; `null` suppresses auto-focus. `undefined` (default) preserves existing behavior on each.
- `Drawer` — now ships proper focus management: saves the previously-focused element on open, restores it on close. Also forwards a ref to the panel element.
- `ConfirmDialog` — focus resolution switched from `setTimeout(0)` to `requestAnimationFrame` for consistency with `Modal`. No visual change.

**Component DX:**

- `Checkbox` — additive `onCheckedChange?: (checked: boolean) => void` parallel prop. Existing `onChange` (raw input event) continues to work; both fire when both are supplied.
- `Avatar.size` — now accepts `AvatarSize | number`. String values map to the existing scale; numeric values render at that pixel size via inline width/height.
- `Button` — new `shape?: 'default' | 'pill'` (`pill` applies `rounded-full`) and `iconOnly?: boolean` (square, no horizontal padding). `Button` now forwards a `ref` to the underlying `<button>` (roadmap B-6 phase 2). Dev-mode warns when `iconOnly` is used without `aria-label`.
- `Pagination` — overhauled to support both modes:
  ```tsx
  // Cursor mode:
  <Pagination
    mode="cursor"
    hasPrevious
    hasNext
    onPreviousPage={prev}
    onNextPage={next}
    label="Showing 1–20 of 156"
    loading={isFetching}
    size="compact"
  />
  ```
  Offset mode unchanged (`currentPage` / `totalPages` / `onPageChange`). New shared props: `loading`, `disabled`, `size?: 'default' | 'compact'`, `label?: ReactNode`.
- `ConfirmWithNoteDialog` — additive `noteMaxLength?: number` (enforces + shows counter) and `noteHelperText?: ReactNode`. Existing `noteRequired` / `noteMinLength` unchanged.

**New layout primitives:**

- `Stack` — vertical flex container with token-aware `gap` (`xs|sm|md|lg|xl`), `align`, `justify`, polymorphic `as`.
- `Inline` — horizontal flex container, same props plus `wrap?: boolean`.
- `PageHeader` — eyebrow + h1 + subtitle + right-aligned `actions` slot.

**New motion primitives:**

- `NumberTicker` — animated count-up (`value`, `from`, `duration`, `formatter`). Honors `prefers-reduced-motion`.
- `TypingAnimation` — char-by-char text reveal (`children`, `duration`, `delay`). Honors `prefers-reduced-motion`.
- `Particles` — canvas-based particle background (`quantity`, `color`, `velocity`, `size`). Pauses when offscreen via `useIntersectionObserver`. Renders an empty `<div>` when `prefers-reduced-motion: reduce`.

**New data display:**

- `JsonView` — recursive renderer with `<details>` semantics, syntax-tinted atoms, configurable `collapsed` depth, and a built-in copy button.

**New utilities:**

- `formatRelativeTime(date, baseDate?, locale?)` — `"5 minutes ago"` / `"in 3 days"` via `Intl.RelativeTimeFormat`. No new deps.
- `formatAbsoluteTime(date, locale?)` — `"May 18, 2026, 3:42 PM"` via `Intl.DateTimeFormat`.

**Token additions** (`@theme` block):

- Radii: `--radius-10px`, `--radius-12px`, `--radius-14px`, `--radius-18px`.
- Shadows: `--shadow-glow-purple`, `--shadow-elevate-md`, `--shadow-elevate-lg`.
- Gradient: `--gradient-accent` (composite `pr_purple → #5b54ee → #292a94`).
- Motion: `--motion-duration-fast|normal|slow` (120ms / 200ms / 320ms), `--motion-ease-standard|emphasized|decelerated` (cubic-bezier).
- Typed mirrors emitted in `tokens.radius`, `tokens.shadows`, `tokens.motionDuration`, `tokens.motionEase`.

**Internal motion infrastructure:**

- New `src/utils/motion.ts` exports `motionDurationS`, `motionEaseBezier`, and `tokenTransition()` bridging CSS motion tokens to framer-motion-ready numbers.
- Overlay animations (`Toast`, `Drawer`, `Sheet`, `BottomSheet`, `Popover`, `Tooltip`, `ConfirmDialog`, `ConfirmWithNoteDialog`, `DatePicker`, `DateRangePicker`, `CommandPalette`) now read durations from motion tokens and skip animation when `prefers-reduced-motion: reduce` is set. No API surface change; near-identical visual timing.
