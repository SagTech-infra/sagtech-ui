# Migration notes

## v2.1.0 — additive, no breaking changes

All v2.1 token work is backwards-compatible. The `sl` breakpoint was aligned
`1025px → 1024px` (it duplicated `xl`); the `sl:` prefix keeps working, with its
boundary shifted by 1px. New additive tokens: `--font-display/body/mono`,
`--gradient-hero/subtle/glow`, `--motion-ease-tech`, `--color-surface-wash`.
`--font-roboto` is deprecated in favour of `--font-body` (Manrope).

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

### v1.9 → v2.0 (BREAKING)

v2.0 is the single breaking-change window: every accumulated `@deprecated` API is removed and naming is aligned with `docs/API_CONVENTIONS.md`. All deprecations were announced in earlier minors. Codemods under `scripts/codemod-v2/` automate the mechanical parts and flag what needs manual review — see the command table at the end.

**1. `Notification` family removed → `Toast`.**

`Notification`, `NotificationWrapper`, `NotificationContext`, `NotificationContextProvider` are gone (deprecated since v1.1). `NotificationCenter` is a separate component and is unaffected. This is a structural migration (provider + context → imperative `toast`):

```diff
- import { NotificationContextProvider, useNotification } from '@sagtech-infra/ui';
+ import { Toaster, toast } from '@sagtech-infra/ui';

  // App root — mount once:
- <NotificationContextProvider>{children}</NotificationContextProvider>
+ <>{children}<Toaster /></>

  // Anywhere — fire a notification:
- const { notify } = useNotification();
- notify({ type: 'success', message: 'Saved' });
+ toast.success('Saved');
```

`toast` also exposes `.error()`, `.warning()`, `.info()`, `.loading()`, `.promise()`, `.dismiss()`, `.update()`. `<Toaster>` accepts `position`, `visibleToasts`, `gap`.

**2. `label` prop unified on `Input` and `PhoneInput`.**

`label` is now the static, `htmlFor`-associated label on every field. Dropzone is unaffected (it never had a label prop).

```diff
  // Input — static label:
- <Input externalLabel="Email" />
+ <Input label="Email" />

  // Input — the old floating label (shown at state="active") is now `floatingLabel`:
- <Input state="active" label="Email" />
+ <Input state="active" floatingLabel="Email" />

  // PhoneInput:
- <PhoneInput externalLabel="Phone" />
+ <PhoneInput label="Phone" />
```

**3. `Attachment.onUpload` → `onChange`** (identical signature, `(files: Array<File> | undefined) => void`):

```diff
- <Attachment onUpload={handleFiles} />
+ <Attachment onChange={handleFiles} />
```

**4. `SelectInput` is controlled-only.** The deprecated `onSelect`, `register` and `name` props are removed; use `value` + `onChange`. react-hook-form integration must be rewired to a controlled field:

```diff
- <SelectInput options={opts} value={v} onSelect={setV} />
+ <SelectInput options={opts} value={v} onChange={setV} />

  // react-hook-form (Controller instead of register/name):
- <SelectInput options={opts} register={register} name="framework" value={v} onChange={...} />
+ <Controller name="framework" control={control} render={({ field }) => (
+   <SelectInput options={opts} value={field.value} onChange={field.onChange} placeholder="…" />
+ )} />
```

**5. `Tabs.defaultIndex` → `defaultValue`** on the items-facade `<Tabs>`. `defaultValue` is the tab id (`tab-<index>`), matching the compound `Tabs.Root` API:

```diff
- <Tabs defaultIndex={1} items={items} />
+ <Tabs defaultValue="tab-1" items={items} />
```

**6. 3D peers bumped to the React 19 line.** Peer deps now require `@react-three/fiber >=9` and `@react-three/drei >=10`. Consumers rendering `Globe3D` / `Scene3D` / `Mindmap3D` / `Network3D` must upgrade those peers:

```bash
pnpm add @react-three/fiber@^9 @react-three/drei@^10
```

`three` stays at `>=0.160`. The internal `src/r3f.d.ts` JSX bridge was removed — fiber 9 augments `react/jsx-runtime` with `ThreeElements` itself.

**7. Callback-name audit.** The remaining public callback surface already conforms to `docs/API_CONVENTIONS.md` (`onChange`, `onClick`, `onClose`, `onOpenChange`, `onConfirm`, `onDrop`, `onFilesAdd`/`onFileRemove`/`onFileRetry`, `onReorder`, `onValueChange`, `onSelect` for menu items, …). No further renames beyond items 2–5 above.

**Codemods** (`scripts/codemod-v2/`, jscodeshift). Run once on your codebase, preview with `--dry --print`:

```bash
pnpm dlx jscodeshift -t scripts/codemod-v2/transforms/<name>.ts "src/**/*.tsx" --parser=tsx --extensions=tsx,ts [--dry --print]
```

| Transform | Automates | Flags for manual review |
| --- | --- | --- |
| `remove-notification-family` | strips the 4 removed imports (keeps `NotificationCenter`) | remaining usages → migrate to `Toast` |
| `input-externalLabel-to-label` | `<Input>`/`<PhoneInput>` `externalLabel`→`label`, Input floating `label`→`floatingLabel` | ambiguous `<Input label>`-only usages |
| `attachment-onUpload-to-onChange` | `<Attachment>` `onUpload`→`onChange` (pure rename) | — |
| `selectInput-onSelect-to-onChange` | `onSelect`→`onChange` when safe | `onSelect`+`onChange` clashes; `register`/`name` rewiring |
| `tabs-defaultIndex-to-defaultValue` | numeric `defaultIndex={N}`→`defaultValue="tab-N"` | dynamic (non-literal) indices |
