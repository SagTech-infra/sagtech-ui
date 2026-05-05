# Roadmap

Сжатая выжимка из мультиаудита 2026-04-22. Исходный документ со всеми file:line-доказательствами и обоснованиями лежит в `~/.claude/plans/transient-roaming-panda.md`.

## Уже смержено

**Первая волна (Critical + базовый High):**
`A-1` Combobox/MultiSelect · `A-2` ConfirmDialog + `useConfirm` · `A-3` DateRangePicker · `A-4` Form система · `A-5` imperative Toast API · `A-6` DataTable · `B-1` `SagtechUIProvider` · `B-3` controlled-first `SelectInput` · `B-6` phase 1 forwardRef

---

## ✅ Critical — закрыто

- [x] **Button `variant="danger"`** (A-opus-smg-1) + `ConfirmDialog` теперь использует нативный danger вместо `!important`-override
- [x] **`NotificationContextProvider` export** (B-opus-smg-1) + файл разнесён: `NotificationContext` чистый (без `'use client'`), `NotificationContextProvider.tsx` с директивой (B-opus-landing-3)
- [x] **Modal stacking + z-index токены**: `--z-dropdown/popover/modal-backdrop/modal/drawer-backdrop/drawer/toast/tooltip` в `theme.css`; `ModalStack.ts` глобально управляет стэком, Escape → topmost, body overflow лок/анлок по счётчику; Drawer/Toaster/NotificationWrapper → токены (B-claude-opus-1, B-opus-smg-3, B-opus-landing)
- [x] **`Typography` polymorphic** (B-opus-lgt-2): `as`-подобное через `tag`, добавлен `'label'`, `htmlFor`, spread пропов; вариантные классы теперь применяются к `p`/`span`/`label`

## ✅ High — закрыто

- [x] **Modal slot-API** (A-opus-smg-2): `title`/`footer` пропы, `size='sm'|'md'`, focus-trap с Tab-cycling, autofocus на первом focusable, `role="dialog"` + `aria-modal` + `aria-labelledby`, восстановление фокуса на триггер
- [x] **`Alert`/`Banner`** (A-7): 4 варианта, `title`/`icon`/`action`/`onClose` слоты, `role="alert"/"status"` + `aria-live`
- [x] **`EmptyState variant='card'`** (расширение A-14 от smg)
- [x] **README.md** (B-claude-opus-4)
- [x] **Input a11y**: `aria-invalid`, `aria-describedby`
- [x] **Button a11y**: `aria-busy`, sync `disabled` + `aria-disabled` при loading
- [x] **`FileDropzone`** (A-10): preview для image/*, progress bar, error-state с retry, maxFiles/maxSize валидация с inline-errors, контролируемый через `files[]` + колбэки
- [x] **`Wizard` + `useWizard`** (A-9): hook + compound (`Wizard.Root`/`Progress`/`Content`/`Footer`), canGoTo-гвард (только до highest-reached), `onNext` с async/false-гвардом
- [x] **`NotificationCenter`** (A-11): bell + dropdown + badge, `notifications[]` prop-driven, unread-bg + dot, timestamp через `Intl.RelativeTimeFormat`, empty-state
- [x] **`SortableList`** (A-20) + `@dnd-kit/*` как optional peer-deps + external в tsup
- [x] **a11y keyboard nav**:
    - `DropdownMenu` — ArrowUp/Down/Home/End, type-ahead, Escape, Tab-close, open-to-first/last, focus management
    - `SelectInput` — ArrowDown/Up/Enter/Space open, ArrowUp/Down nav в дропдауне, Home/End, Escape + focus restore, активная опция подсвечивается (`isHighlighted`)
    - `Popover` — Escape close + focus restore, `aria-expanded`, `aria-haspopup="dialog"`
    - `CommandPalette` — Home/End в дополнение к существующим Arrow/Enter/Escape

## ✅ Medium — закрыто

- [x] **`useStatusColor(status)` hook** (A-8): встроенный маппинг success/warning/error/info/neutral + override через `customMap`
- [x] **Skeleton presets** (A-17): `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`, `SkeletonTable`, `SkeletonList`
- [x] **`ConfirmWithNote`** (расширение A-2 от smg): `useConfirmWithNote({ noteRequired, noteMinLength, noteLabel, notePlaceholder })` → `Promise<{confirmed, note}>`
- [x] **Typography heading variants** (A-claude-opus-5): `DisplayXL`, `DisplayL`, `SectionTitleL/M/S`
- [x] **App-chrome + status иконки** (A-claude-opus-1, A-opus-smg-3): `menu`, `plus`, `edit`, `trash`, `eye`, `eyeOff`, `filter`, `search`, `info`, `warning`, `checkCircle`, `alertTriangle`, `lock`, `document`, `users`, `calendar`, `settings` — все через `currentColor`, реагируют на `color` проп
- [x] **`Container`** (A-opus-lgt-3): `size='sm'|'md'|'lg'|'xl'|'full'`, `as` (div/section/main/article)
- [x] **DatePicker showTime** (A-claude-opus-6): `showTime?: boolean`, `timeStep?: number` (default 5), hours+minutes `<select>` внизу календаря
- [x] **`Attachment.accept: string`** (B-opus-smg-2): типизация расширена до `string` — любая HTML-строка
- [x] **`'use client'` split у NotificationContext** (B-opus-landing-3): тип + context отдельно от Provider'а → RSC-потребители могут импортировать тип без client-boundary
- [x] **Runtime-asserts для optional peer-deps** (B-10): задокументированы в README (раздел Peer dependencies с описанием, какой компонент какой peer требует)

## ✅ Low — закрыто

- [x] **`Rate`** (A-opus-lgt-4): read-only N-звёздочный UI, tone-цвет по ratio или через prop, label для a11y
- [x] **Canonical-guide** (A-opus-smg-4, A-opus-smg-5) → `docs/COMPONENT_PICKER.md`
- [x] **`InlineEdit`** (A-23): click-to-edit с Enter/Esc, multiline с Cmd+Enter, `validate` callback, async `onSave`, disabled
- [x] **`CodeBlock`** (A-15): встроенный regex-highlighter для ts/tsx/js/jsx/json/bash/css/html + prop `highlight` для подключения Prism/Shiki; filename, lineNumbers, copyable, maxHeight
- [x] **`VariablePicker`** (A-opus-lgt-2): Modal + search + source-filter chips + двойной клик / Insert; copy-to-clipboard per-item
- [x] **`CommandPaletteProvider` + `useRegisterCommand`** (A-21): context-based регистрация команд из поддерева, глобальный hotkey (Cmd/Ctrl+K по умолчанию, настраиваемый)
- [x] **`VirtualList`** (A-19): обёртка над `@tanstack/react-virtual` (optional peer), fixed/dynamic row heights через `estimateSize`
- [x] **`RichTextEditor`** (A-18): TipTap + StarterKit (`@tiptap/react`/`core`/`starter-kit` как optional peers), toolbar с bold/italic/strike/heading/list/quote/code/undo/redo, placeholder, disabled, extensions-prop для расширения
- [x] **`VisualGraphEditor`** (A-opus-lgt-1): обёртка над `@xyflow/react` (optional peer), встроенный Provider, controls, minimap, background; кастом nodeTypes/edgeTypes; readOnly режим
- [x] **`GanttTimeline`** (A-22): scale day/week/month, lane-группировка, bar с progress, per-item color variants, click-handler

## ✅ Техдолг — закрыто

- [x] **`declare module '*.css'`** (B-13) — `src/css.d.ts` включая `swiper/css`, `react-international-phone/style.css`, `@xyflow/react/dist/style.css`. Все `// @ts-ignore` на CSS-импортах удалены.
- [x] **`array-index-key` в Timeline** (B-9) — удалён ручной key, React.Children.map сам проставляет стабильные ключи.
- [x] **B-2 Smoke-тесты для новых компонентов** — Alert, Rate, InlineEdit, CodeBlock, Wizard/useWizard, NotificationCenter, FileDropzone, Container, SortableList, VariablePicker, CommandPaletteProvider, GanttTimeline. **136 tests** зелёных (+48 новых). VirtualList / RichTextEditor / VisualGraphEditor — рендер-smoke оставлены на отдельный sprint (нужны IntersectionObserver / ProseMirror / ReactFlow моки в happy-dom).
- [x] **B-opus-smg-4 `tokens.d.ts`** — `scripts/generate-tokens.mjs` парсит `theme.css` и генерирует `src/tokens/tokens.ts` (133 типизированных константы: colors, fonts, textSizes, spacing, breakpoints, shadows, radius, borderWidths, zIndex + типы `ColorToken`/`SpacingToken`/etc). `prebuild` hook гонит генератор перед билдом; `pnpm generate:tokens` запускает вручную. Экспортировано из root как namespace `tokens`.
- [x] **B-opus-landing-2 Callback-naming** — задокументировано в `docs/API_CONVENTIONS.md`: таблица canonical имён (`onChange`, `onSelect`, `onClose`, `onOpenChange`, `onReorder`, `onComplete`, `onFilesAdd`/`onFileRemove`/`onFileRetry`), правило для новых компонентов + список legacy-разногласий с `@deprecated`-алиасами. Рефакторинг старых имён = breaking, идёт отдельной миграцией.
- [x] **B-7 `any` / ts-ignore** — устранены все 4 случая в src: `NotificationWrapper.tsx` (`state as any` → напрямую, после сужения типа в контексте), `PhoneInput.tsx` (`detectedCountry as any` → типизация через `CountryIso2` из react-international-phone; `detectCountry(): CountryIso2`), `Table.tsx` (`any` → `unknown`), `Timeline/swiper-settings.ts` (`any` → `SwiperOptions` из `swiper/types`).
- [x] **B-opus-lgt-3 Package-name alias** — решение зафиксировано в `docs/MIGRATION.md`: canonical имя `@sagtech-infra/ui`; потребители либо перепишут импорты при апгрейде, либо оставят alias через `tsconfig paths`. Breaking-changes каталог для `1.0.0` там же.

## 🚧 Остаётся

- **Расширенное тестовое покрытие** — `VirtualList` (IntersectionObserver/ResizeObserver моки + viewport-height), `RichTextEditor` (ProseMirror + happy-dom), `VisualGraphEditor` (ReactFlow + canvas/PointerEvent). Варианты: (а) jsdom + моки, (б) Playwright component-тесты против Storybook.
- **Унификация `label` prop** по Input/PhoneInput/Dropzone — сейчас `externalLabel`. Breaking, даст чистое API.
- **Депрекация `onUpload` в Attachment** → `onChange`. Breaking.

---

**Ссылка на исходный мультиаудит:** `~/.claude/plans/transient-roaming-panda.md`

---

## ✅ v1.1 — released 2026-05-05

**New components (23):**
- Charts: `AreaChart`, `BarChart`, `HeatmapChart`, `RadarChart`, `SparklineChart`, `ScatterChart`, `GaugeChart`, `SankeyChart`, `TreemapChart`, `FunnelChart` (all canvas-based, no new peers).
- 3D / WebGL: `Network3D`, `Globe3D`, `Scene3D`, `Mindmap3D` (optional peers: `three`, `@react-three/fiber`, `@react-three/drei`, `react-force-graph-3d`).
- Overlays/UX: `Sheet`, `BottomSheet`, `Banner`, `Spotlight`, `FAB`, `SegmentedControl`, `Stepper`, `KBD`, `Toolbar` (+ `ToolbarSeparator` compound).

**Improvements (additive, non-breaking):**
- `Modal` forwards ref; new `motionVariants?` prop.
- `Drawer` integrates ModalStack for proper stacking; uses `--z-drawer` token.
- `Alert.autoDismiss?: number`.
- `ConfirmDialog.confirmDisabled?: boolean`.
- `CookieBanner.position?` and `children?` slot.

**Cleanup:**
- Z-index hard-codes across Toaster / Popover / Tooltip / CommandPalette / ConfirmDialog / CookieBanner replaced with `--z-*` CSS vars (`tokens.zIndex.*`).
- New `--z-banner: 4500` token added.
- `LineChart` spline helper extracted to `LineChart/spline.ts` (reused by `AreaChart`).
- `Notification`, `NotificationContext`, `NotificationContextProvider`, `NotificationWrapper` marked `@deprecated` (use `Toast`). Removal scheduled for v2.0.

**Tests**: 136 → 164 (28 new across SegmentedControl/Stepper/Toolbar).
