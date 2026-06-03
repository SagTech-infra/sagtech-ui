# Roadmap

Сжатая выжимка из мультиаудита 2026-04-22. Исходный документ со всеми file:line-доказательствами и обоснованиями лежит в `~/.claude/plans/transient-roaming-panda.md`.

## v2.3.0 — marketing-блоки + лендинг (additive)

- **Новые компоненты** (категория Marketing): `Hero`, `FeatureGrid`, `StatGrid` (анимация на `NumberTicker`), `CTASection` — переиспользуемые блоки для лендингов.
- **Лендинг докпортала** (`apps/docs/app/page.tsx`) пересобран из них (sagtech.io-inspired структура: hero → stats → features → live showcase → FAQ на `Accordion` → CTA + футер); догфуд.
- Опираются на бренд-токены v2.1 (`--gradient-hero/glow`, `font-display`, `--motion-ease-tech`, `--color-surface-wash`).

## v2.2.0 — компоненты + a11y (additive)

- **Новые компоненты**: Accordion (WAI-ARIA, клавиатура Up/Down/Home/End), ContextMenu (right-click/long-press), ScrollArea, HoverCard, NumberInput, AspectRatio.
- **a11y-утилиты**: VisuallyHidden, Label, FieldSet.
- **Тесты**: добавлены для Input/TextArea/RadioGroup/PhoneInput — всего **749** (+112).
- **a11y-скан**: `jest-axe` + `pnpm test:a11y` (курируемый набор), matcher в `vitest.setup.ts`; гоняется в CI через `pnpm test`.
- Reuse-first: на `Popover`/`DropdownMenu`/`Input`/`Slider`/`scrollbar.css` + хуки `useRovingTabindex`/`useTypeahead`/`useOutsideClick`/`Portal`.

## v2.1.0 — бренд-слой (additive, non-breaking)

- **Шрифт-роли**: `--font-display` (Orbitron), `--font-body` (Manrope), `--font-mono` (системный mono-стек); старые `font-orbitron/roboto/manrope` сохранены, `roboto` помечен `@deprecated`.
- **Брейкпоинт `sl`** выровнен `1025px → 1024px` (алиас `xl`; имя сохранено, `sl:` продолжает работать).
- **Light-mode — полноценная фича**: акценты (`pr_purple/sec_purple/pr_blue/sec_blue`) инвертированы под AA-контраст на светлом фоне; `check:contrast` зелёный для обоих тем; добавлена витрина `Theming/Light Showcase`.
- **Брендовые градиенты**: `--gradient-hero/subtle/glow` (+ утилиты `bg-gradient-*`).
- **Фирменный motion-ease**: `--motion-ease-tech` (резкий «снэп»).
- **Purple-wash фоны**: `--color-surface-wash` (лёгкий бренд-тинт для tertiary-поверхностей).
- **Showcase**: дог-фуд доку-портал `apps/docs` (Next, 108 компонент-страниц, гайды, charts/3D-галереи) + Chromatic CI; фикс serif→sans-serif fallback.

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
- [x] **`FileDropzone`** (A-10): preview для image/\*, progress bar, error-state с retry, maxFiles/maxSize валидация с inline-errors, контролируемый через `files[]` + колбэки
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

- **Расширенное тестовое покрытие** — частично закрыто в v1.8 (логика/wiring: VirtualList count-math, VisualGraphEditor change-адаптеры через file-scoped ReactFlow-мок, RichTextEditor controlled/disabled/command). Жёсткие стены, требующие реального браузера (scroll-windowing VirtualList, pointer-drag/fitView VisualGraphEditor, paste/drop RichTextEditor), **закрыты в v1.9** через Playwright component-тесты (`pnpm test:ct`).
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

---

## ✅ v1.2 — released 2026-05-14

**Fixes / additive (no breaking):**

- `DatePicker` — popover renders into `document.body` via Portal so it escapes `overflow:hidden` ancestors (e.g. `CardWrapper`). Viewport-relative positioning with auto flip-up when there's no room below; re-positions on scroll/resize.
- `GaugeChart` — new `showRange?: boolean` (default `true`) to hide the min/max tick labels at the ends of the arc.
- `RichTextEditor` — pass `immediatelyRender: false` to Tiptap v3's `useEditor` to silence the SSR warning; first render deferred to the client.

**Tests**: 164/164 (unchanged in this release).

---

## ✅ v1.3 — released 2026-05-18 — a11y blockers + DX + motion infrastructure

Большой аддитивный релиз, закрывающий весь consumer-audit от 2026-05-18 (`UI library gaps audit`). Zero breaking changes — drop-in upgrade from `1.2.x`.

**Accessibility (Critical / High):**

- `Tabs` — новый compound API (`Tabs.Root/List/Trigger/Content`) рядом с `items`-фасадом. Полная ARIA (`tablist`/`tab`/`tabpanel` + `aria-selected`/`controls`/`labelledby`), roving tabindex, arrow-keys / Home / End / Enter / Space, `orientation`, `activationMode`, `lazyMount`. `defaultIndex` → `@deprecated` (удалить в v2.0).
- `Modal` / `Drawer` / `ConfirmDialog` — новый `initialFocusTarget?: string | HTMLElement | RefObject<HTMLElement> | null` prop.
- `Drawer` — focus management (save/restore previously-focused element) + `forwardRef` на панель.
- `ConfirmDialog` — `setTimeout(0)` → `requestAnimationFrame` для consistency с Modal.
- `ConfirmWithNoteDialog` — новые `noteMaxLength` (счётчик символов) и `noteHelperText`.

**Component DX:**

- `Checkbox` — additive `onCheckedChange?: (checked: boolean) => void`. Существующий `onChange` (raw input event) не сломан.
- `Avatar.size` — `AvatarSize | number` (string остаётся, число рендерится через inline width/height).
- `Button` — `shape?: 'default' | 'pill'`, `iconOnly?: boolean`, `forwardRef<HTMLButtonElement>` (закрывает B-6 phase 2).
- `Pagination` — overhaul: `mode?: 'offset' | 'cursor'` (offset как было; cursor — `hasPrevious`/`hasNext`/`onPreviousPage`/`onNextPage`), `loading`, `disabled`, `size?: 'default' | 'compact'`, `label` slot.

**Новые компоненты:**

- Layout: `Stack`, `Inline` (token-aware gap/align/justify), `PageHeader` (eyebrow + h1 + subtitle + actions).
- Motion: `NumberTicker`, `TypingAnimation`, `Particles` — все honor `prefers-reduced-motion`.
- Data display: `JsonView` — recursive рендер с `<details>` + copy.

**Утилиты:**

- `formatRelativeTime`, `formatAbsoluteTime` (Intl-based, no new deps).
- `src/utils/motion.ts` — `motionDurationS`, `motionEaseBezier`, `tokenTransition()` для framer-motion.

**Токены:**

- Radii `10/12/14/18px`, shadows `glow-purple` / `elevate-md` / `elevate-lg`, `--gradient-accent` композит, motion `--motion-duration-{fast,normal,slow}` + `--motion-ease-{standard,emphasized,decelerated}`. Все типизированы в `tokens.ts`.

**Motion infrastructure:**

- Все overlays (`Toast` / `Drawer` / `Sheet` / `BottomSheet` / `Popover` / `Tooltip` / `ConfirmDialog` / `ConfirmWithNoteDialog` / `DatePicker` / `DateRangePicker` / `CommandPalette`) читают длительности из токенов и снимают анимации при `prefers-reduced-motion: reduce`.

**Перенесено в Backlog / v1.4+:**

- `JsonDiffView` (диффы с подсветкой) — отдельный компонент, отложен.
- Vertical orientation polish для `Tabs`.

**Tests**: 299/299.

---

## ✅ v1.3.1 — released 2026-05-25

Патч-релиз: закрыл отложенные из v1.3 backlog-пункты. Без изменения поведения, без breaking.

- **`SelectDropdownLayout` token cleanup** — хардкод `bg-[#1B1B27]` → новый токен `--color-black_1_5` (`#1b1b27`) → `bg-black_1_5`. Рендер идентичен.
- **Smoke-тесты v1.1 overlays** — `Banner`, `Spotlight`, `FAB` (+ `Sheet`, `BottomSheet`) получают render/onClose-покрытие. Закрывает отложенный из v1.3 пункт.
- **`.env.example`** — задокументирован `NODE_AUTH_TOKEN` для GitHub Packages; `.env*` добавлены в `.gitignore`.

---

## ✅ v1.4 — released 2026-05-25 — light theme + motion presets

Большая аддитивная фича. Не breaking — старые консюмеры остаются на dark по умолчанию.

**Shipped:** семантический слой токенов (`--color-bg/fg/border/surface-*` + status) с dark-дефолтами и `[data-theme="light"]` override (включая raw-scale — гибрид); `ThemeProvider` + `useTheme` + `<ThemeScript/>` (dark/light/system, localStorage `sagtech-ui-theme`, `data-theme`+`color-scheme` на `<html>`); WCAG-гейт `scripts/check-contrast.mjs` (`pnpm check:contrast`, AA на обеих темах); motion-пресеты `fadeIn/slideUp/scaleIn/popIn` + `useMotionPreset` (reduced-motion); консолидация идентичных overlay-variants в `src/motion/overlayVariants.ts`; миграция overlays + base form-controls на семантику; Storybook theme-switcher; `docs/THEMING.md` + `docs/MOTION.md`. Tests 331 → 346.

**Scope-уточнения:** консолидация motion — консервативная (только буквальные дубли `Popover`/`Tooltip` + `DatePicker`/`DateRangePicker`; `Drawer`/`Sheet`/`Modal`/`Toast` — кандидаты на будущее, разные key-conventions). Обнаружен пред-существующий a11y-пробел: base form-controls используют `outline-none` без кастомного focus-ring — это не регрессия light-темы (одинаково в обеих темах), вынесено в v1.5 a11y-polish.

**Light theme:**

- Семантический слой токенов в `theme.css`: `--bg-primary/secondary/tertiary`, `--fg-primary/secondary/muted`, `--border-default/strong`, `--surface-overlay`. Сегодняшние `black_1..4` / `white_1..4` / `grey_*` остаются как raw scale под темой `dark`. Для темы `light` — параллельная палитра. Покрытие: backgrounds, foregrounds, borders, surfaces, status-варианты (success/warning/error/info под обе темы).
- **`ThemeProvider`** (новый, или расширение `SagtechUIProvider`) с пропом `theme: 'dark' | 'light' | 'system'`. Применение через `data-theme` атрибут на root + CSS-vars cascade. `system` слушает `prefers-color-scheme` через `matchMedia`.
- Компоненты переходят на семантические токены (`bg-[var(--bg-primary)]`), а не на `bg-black_1` напрямую. Старые dark-классы продолжают работать; новые компоненты пишутся на семантику.
- A11y / contrast аудит light-темы: focus-visible rings, WCAG AA контрасты, screen-reader smoke на ключевых overlays.
- Storybook: глобальный theme switcher в toolbar, чтобы превьюшки переключались dark/light.

**Motion presets:**

- На базе motion-токенов из v1.3 — готовые `fadeIn`, `slideUp`, `scaleIn`, `popIn` варианты (функции, возвращающие framer-motion `Variants`).
- Reuse в `Toast` / `Modal` / `Drawer` / `Popover` / `Tooltip` — убрать дублирование `dropdownVariants` объектов по компонентам.
- Опционально — `useMotionPreset(name, options?)` hook для кастомных компонентов потребителей.

---

## ✅ v1.5 — released 2026-05-25 — coverage push + a11y / i18n polish

Аддитивный релиз, **zero breaking**. Дефолты `locale`/`dir` = `en-US`/`ltr` — консюмеры без `LocaleProvider` не меняются.

**Shipped:** рендер-smoke хвоста (`VirtualList`/`RichTextEditor`/`VisualGraphEditor` + 10 canvas-чартов + 4 3D-сцены) на глобальных моках `IntersectionObserver`/`ResizeObserver`/canvas-2D/three+r3f+drei+react-force-graph-3d в `vitest.setup.ts`; theme-aware `:focus-visible` кольца на base form-controls (`Input`/`Button`/`SelectInput`, видимы в обеих темах); новый `LocaleProvider` + `useLocale()` (`{ locale, dir }`), композируется в `SagtechUIProvider`; locale-aware даты через `Intl` (`DatePicker`/`DateRangePicker`/`GanttTimeline`, Monday-first сетка сохранена); RTL через Tailwind v4 logical properties (`ps/pe/ms/me/start/end`, `border-s/e`) + `dir` на корнях (включая порталы) для form-controls и overlays (`Tooltip`/`Popover`/`Drawer`/`Sheet`/`Modal`/`Toaster`/`BottomSheet`/`DatePicker`/`DateRangePicker`); консолидация Drawer/Sheet edge-slide в `edgeSlideVariants(edge,dir)`; raw→semantic миграция high-traffic (`GanttTimeline`/`DataTable`/`Pagination`/`Combobox`/`NotificationCenter`); Storybook-стори (`Container`, `ThemeProvider`, `LocaleProvider`, `Motion/Presets`); `addon-a11y` подтверждён активным; CI `publish.yml` → actions v5 + Node 24 (GitHub Node-20 EOL 2026-06-02); `docs/I18N.md`. Tests **346 → 438**.

**Scope-уточнения / отложено:** canvas-чарты используют JS-цвета на `<canvas>` (не Tailwind-классы) → их theming/RTL/locale — отдельная задача (backlog); `GanttTimeline`-ось остаётся геометрически LTR (локализуются только тики); `NotificationCenter`-дропдаун не входил в RTL-аудит (контент локализуется, сторона открытия не флипается); 4px directional-fade офсет `Popover`/`Tooltip` не зеркалится.

<details><summary>Исходный план v1.5</summary>

- **Render-smoke тесты для долгого хвоста.** `VirtualList` (IntersectionObserver / ResizeObserver моки в `vitest.setup.ts`), `RichTextEditor` (ProseMirror happy-dom mocks), `VisualGraphEditor` (ReactFlow моки). Альтернатива — Playwright component-tests против Storybook (опциональный путь).
- **Canvas-чарты smoke** — 10 чартов v1.1 (`AreaChart`, `BarChart`, `HeatmapChart`, `RadarChart`, `ScatterChart`, `GaugeChart`, `SankeyChart`, `FunnelChart`, `SparklineChart`, `TreemapChart`) получают mount-смоук + проверку отрисованных props. Глубже не лезем — canvas-снапшоты ненадёжны в happy-dom.
- **3D-suite smoke.** Моки `three` / `@react-three/fiber` / `react-force-graph-3d`, рендер пустых сцен без падений (`Network3D`, `Globe3D`, `Scene3D`, `Mindmap3D`).
- **i18n hooks для дат/времени.** `DatePicker` / `DateRangePicker` / `GanttTimeline` — weekdays/months через `Intl.DateTimeFormat` вместо констант. Локаль из `ThemeProvider` или нового `LocaleProvider`.
- **RTL audit.** Overlays и form-controls под `dir="rtl"` — починить асимметричные паддинги/иконки/выравнивания.
- **Storybook a11y addon** (локально, без деплоя) — `@storybook/addon-a11y`, прогон по существующим сторям.

</details>

---

## ✅ v2.0 — released 2026-06-01 — breaking cleanup (deprecated API removal + r3f@9)

**MAJOR.** Все накопленные breakings одним окном; имена выровнены под `docs/API_CONVENTIONS.md`. Полная миграция с before/after и codemod-командами — `docs/MIGRATION.md` (v1.9 → v2.0). Решение задокументировано в ADR-0006.

**Removed / renamed (breaking):**

- **`Notification` family удалён** (`Notification`, `NotificationContext`, `NotificationContextProvider`, `NotificationWrapper`; deprecated с v1.1) → `Toast` (`<Toaster/>` + imperative `toast.*`). `NotificationCenter` не затронут.
- **`label` унифицирован**: `Input` / `PhoneInput` `externalLabel` → `label` (статичный, per canon); старый floating `Input.label` → `floatingLabel`. `Dropzone` не затронут (label не было — расхождение с первоначальным планом).
- **`Attachment.onUpload` → `onChange`** (сигнатура идентична).
- **`SelectInput` controlled-only**: удалены `onSelect`, `register`, `name`.
- **`Tabs.defaultIndex` → `defaultValue`** (`tab-<index>`) на items-фасаде.
- **3D peers**: `@react-three/fiber >=9`, `@react-three/drei >=10` (React 19 line); `three` остаётся `>=0.160`. `src/r3f.d.ts` удалён (fiber 9 даёт нативный JSX-bridge); полиморфные `Inline`/`Stack` переведены на `React.createElement`, чтобы `ThreeElements` не схлопывал `children` в `never`.
- **Callback-аудит**: остальная публичная callback-поверхность уже канонична — новых ренеймов нет.

**Codemods** (`scripts/codemod-v2/`, jscodeshift) дописаны до best-effort + flagging с фикстурами: `remove-notification-family`, `input-externalLabel-to-label` (Input+PhoneInput), `attachment-onUpload-to-onChange`, `selectInput-onSelect-to-onChange`, `tabs-defaultIndex-to-defaultValue`. Структурные кейсы (provider→imperative, dynamic index, register/name) помечаются комментом для ручной правки.

**Gate** зелёный: typecheck / lint / test (637 vitest) / build / check:contrast / check:directives / check:size / coverage.

---

## ✅ v1.9 — released 2026-06-01 — Playwright CT + RSC directives + coverage ratchet

Аддитивный релиз, **zero breaking**. Закрывает осознанно отложенный из v1.8 техдолг качества/тестирования.

**Shipped:**
- **Playwright component-тесты** (`@playwright/experimental-ct-react`, `pnpm test:ct`, локально — НЕ в основном CI-гейте; см. **ADR-0004**) для поведения, которое happy-dom физически не покрывает. 16 спеков в реальном Chromium через fixture-компоненты (render-props/extensions исполняются в браузере, наружу — только сериализуемые пропсы): **VirtualList** (scroll-windowing, `measureElement` remeasure, overscan), **VisualGraphEditor** (pointer-drag → `onNodesChange`, `fitView`-трансформа, MiniMap, readOnly-guard), **RichTextEditor** (image paste/drop, mention/slash popover + keyboard-select, lowlight `.hljs-*` спаны), focus-ring (рендер `box-shadow` под `:focus-visible`). CT-конфиг переиспользует Tailwind/`@`/next-mocks-окружение Storybook; `playwright/index.css` добавляет `@source` чтобы Tailwind v4 генерил утилиты `src/components`. Закрывает backlog-пункт «жёсткие стены happy-dom».
- **fix: выбор пункта в suggestion-popover `RichTextEditor` теперь вставляет узел** — баг, вскрытый CT: mention `@` / slash `/` ничего не вставляли (портальный `onSelect` шёл в no-op, TipTap-`command` не вызывался — текст оставался `suggestion`-декорацией). Заодно починены клавиатурная навигация (подсветка была заморожена — `forceUpdate` не дёргал setState; заменён на `useReducer`) и race ленивого `import('@tiptap/react')` (теперь статический — `@tiptap/react` и так в том же чанке).
- **preserve `'use client'` в `dist/`** (**ADR-0005**) — esbuild стрипал все директивы (dist шёл без единой → ломал RSC-консьюмеров). tsup `onSuccess` (`scripts/add-use-client.mjs`) штампует директиву на client-entry (`index`/`3d`/`charts`, ESM+CJS); директива на entry делает весь импортируемый граф client-границей, поэтому чанки её не требуют, а `./icons` остаётся server-safe. Гард `scripts/check-directives.mjs` (`pnpm check:directives`) в гейте + `ci.yml`.
- **Coverage thresholds (ratchet)** — coverage переключён с report-only на enforced; пороги (stmts 55 / branches 72 / funcs 53 / lines 55) чуть ниже измеренного, ловят регресс без поломок на мелких изменениях. 3D `*Core` исключены (WebGL-peer'ы замоканы в no-op). Canvas-чарты и geometry-пути CT-компонентов остаются в отчёте, но верифицируются Playwright CT (отдельный слой, не мержится).

**Tests**: 639 vitest (без изменений) + 16 новых Playwright CT-спеков (отдельный браузерный слой). Новые ADR: **0004** (Playwright CT), **0005** (preserve directives).

Отложено осознанно: nightly/manual CI-job для `test:ct`; codemod-v2 стабы (v2.0-задел).

---

## ✅ v1.8 — released 2026-06-01 — syntax-highlight preset + lazy 3D + coverage + ADR/codemod

Аддитивный релиз, **zero breaking**. Всё новое добавлено поверх существующего API.

**Shipped:**
- **`createSyntaxHighlightExtension({ languages?, lowlight?, defaultLanguage? })` + `resolveLowlight`** — пресет подсветки кода для `RichTextEditor` на `@tiptap/extension-code-block-lowlight` + `lowlight` v3 (`common` ~37 / `all` 190+ грамматик, либо инжектируемый instance). Парный additive-проп **`RichTextEditor.starterKitOptions`** (нужно `{{ codeBlock: false }}` — иначе дубликат node `codeBlock` со StarterKit). Темизация `.hljs-*` через `src/tokens/hljs.css` на raw-токенах (редактор dark-only). Два новых optional peer'а объявлены во всех четырёх местах. Закрывает backlog-пункт «syntax-highlight для code-block».
- **Lazy-load 3D peers** — `Network3D`/`Globe3D`/`Scene3D`/`Mindmap3D` разбиты на лёгкую обёртку + `<Name>Core` через `React.lazy` + `<Suspense>`. Тяжёлые peer'ы (`react-force-graph-3d`, `@react-three/fiber`+`drei`+`three`) уходят в lazy-чанки: статический граф ESM-входа `@sagtech-infra/ui/3d` их не тянет (проверено в `dist/`). Additive-проп `loadingFallback` на всех четырёх. CJS остаётся eager (tsup CJS-splitting экспериментальный) — без регресса. Закрывает backlog-пункт «dynamic peers».
- **Расширенное тест-покрытие (600 → 639)** — VirtualList (count-driven spacer), VisualGraphEditor (file-scoped ReactFlow-мок для change/connect/readOnly/click-адаптеров), RichTextEditor (controlled-value/disabled/extension/command), syntax-highlight preset, async 3D-обёртки. Report-only coverage через `@vitest/coverage-v8` (`pnpm coverage`, без порогов).
- **`docs/adr/`** — ADR-лог в формате MADR (README-индекс + template + 3 ретроспективных ADR: dark-first токены, canvas-чарты вместо apexcharts, паттерн optional-peers с authoritative-чеклистом «4 места»).
- **`scripts/codemod-v2/`** — jscodeshift-каркас под v2.0-переименования (рабочий `input-externalLabel-to-label` + фикстуры, `attachment-onUpload-to-onChange`, 3 стаба). Publish-safe (вне `files[]`).
- **CI** — `pnpm/action-setup` v4 → v6 (Node 24 runtime) в `ci.yml` + `publish.yml` перед форсом Node-20-deprecation от GitHub (2026-06-02).

Отложено осознанно: Playwright component-тесты для жёстких стен (реальный scroll-windowing VirtualList, pointer-drag/fitView VisualGraphEditor, paste/drop RichTextEditor) — кандидат на v1.9+; preserve-directives build-шаг для `'use client'` в split-чанках — отдельный follow-up. → **оба закрыты в v1.9** (Playwright CT + `'use client'`-штамп на client-entry).

---

## ✅ v1.7 — released 2026-06-01 — RichTextEditor presets + v1.6 follow-ups + RSC hygiene

Аддитивный релиз, **zero breaking**. Все новые фабрики, хуки и peer-зависимости добавлены поверх существующего API.

**Shipped:** три composable, tree-shakable фабрики для `RichTextEditor`, экспортируемых из main entry: `createMentionExtension({ items, char })` — @-trigger mentions с sync-массивом или async-фетчером `(query)=>Promise<MentionItem[]>`; `createSlashCommandExtension({ commands })` + `defaultSlashCommands` (H2, H3, bullet list, ordered list, quote, code) — «/»-меню на `@tiptap/suggestion`; `createImageUploadExtension({ upload, accept, maxSize, onError })` — paste/drop картинок с валидацией типа и размера на границе, `upload:(file)=>Promise<string>` для финального URL или inline base64 без загрузчика, ошибки через `onError` (не глотаются). Suggestion-popover внутри (TipTap `ReactRenderer` + ProseMirror `clientRect`; без `floating-ui`), семантические токены + RTL через `useLocale()`. Также экспортируется хелпер `validateImageFile`. Три новых OPTIONAL peer'а, прописанных во всех 4 местах (`peerDependencies >=2.0.0` + `peerDependenciesMeta.optional` + `tsup external` + `.size-limit ignore`): `@tiptap/extension-mention`, `@tiptap/suggestion`, `@tiptap/extension-image`. v1.6 follow-up fixes: `TreeView` type-ahead теперь циклически обходит элементы с одинаковым первым символом (ARIA APG); lazy-нода, чей loader вернул `[]`, сворачивается в лист (больше нет `aria-expanded`-тупика); `Carousel` autoplay останавливается на последнем слайде при `loop=false`; `Calendar` locale-aware first day of week (`Intl.Locale().weekInfo`, Monday fallback), новый prop `weekStartsOn` для ручного override — en-US теперь Sunday-first; `DatePicker`/`DateRangePicker` используют общий util и остаются консистентными. RSC-гигиена: чистые типы и константы вынесены из нескольких `'use client'`-модулей (`Modal`, `Drawer`, `ConfirmDialog`, провайдеры `SagtechUI`/`Theme`/`Locale`/`UIComponents`) в соседние non-client файлы — Server Components могут импортировать типы без client-границы; runtime и публичный API не изменились. Обслуживание: удалены `apexcharts`/`react-apexcharts` из devDependencies (чарты — чистый canvas/SVG, а не ApexCharts обёртки); документация по чартам исправлена; display-имя publish-воркфлоу переименовано в `@sagtech-infra/ui`. Tests **541 → 600**. Gate green: typecheck, lint, test, build, check:contrast, check:size (main entry 415/515 KB gzip).

**RichTextEditor extension presets:**

- `createMentionExtension({ items, char })` — `@`-trigger mentions. `items` — sync `MentionItem[]` или async `(query: string) => Promise<MentionItem[]>`. `MentionItem = { id, label }`. Suggestion-popover встроен (без `floating-ui`), RTL через `useLocale()`.
- `createSlashCommandExtension({ commands })` + `defaultSlashCommands` — «/»-меню. `defaultSlashCommands` покрывает H2, H3, bullet list, ordered list, quote, code. Выстроено на `@tiptap/suggestion`.
- `createImageUploadExtension({ upload, accept, maxSize, onError })` — paste/drop. Валидирует тип и размер перед вызовом `upload`; inline base64 fallback когда `upload` не передан; ошибки через `onError`. Экспортирует хелпер `validateImageFile(file, { accept, maxSize })`.

**Новые optional peers:**

- `@tiptap/extension-mention` — нужен для `createMentionExtension`.
- `@tiptap/suggestion` — нужен для `createMentionExtension` и `createSlashCommandExtension`.
- `@tiptap/extension-image` — нужен для `createImageUploadExtension`.

**v1.6 follow-up fixes:**

- `TreeView` type-ahead циклически обходит элементы с одинаковым первым символом (ARIA APG).
- `TreeView` lazy-нода с пустым loader-результатом (`[]`) сворачивается в лист — нет `aria-expanded`-тупика.
- `Carousel` autoplay останавливается на последнем слайде при `loop=false`.
- `Calendar` locale-aware first day of week (`Intl.Locale().weekInfo`, Monday fallback). Новый prop `weekStartsOn` для ручного override. en-US → Sunday-first. `DatePicker`/`DateRangePicker` консистентны через общий util.

**RSC-гигиена:**

- Чистые типы и константы вынесены из `'use client'`-модулей (`Modal`, `Drawer`, `ConfirmDialog`, провайдеры `SagtechUI`/`Theme`/`Locale`/`UIComponents`) в соседние non-client файлы.
- Server Components могут импортировать типы без подтягивания client-графа.
- Runtime и публичный API не изменились.

**Обслуживание:**

- Удалены `apexcharts`/`react-apexcharts` из devDependencies (чарты — чистый canvas/SVG).
- Документация по чартам исправлена.
- Display-имя publish-воркфлоу переименовано в `@sagtech-infra/ui`.

---

## ✅ v1.6 — released 2026-06-01 — primitives + chart theming + bundle isolation

Аддитивный релиз, **zero breaking**. Все новые компоненты, хуки и subpath-экспорты добавлены поверх существующего API; главный entry по-прежнему ре-экспортирует всё.

**Shipped:** девять новых примитивов закрывают долгоиграющий backlog — form-controls `Switch` (labeled form switch), `Slider`/`RangeInput` (single + two-thumb range, marks, keyboard, RTL, ARIA `slider`), `TimePicker` (standalone hours/minutes, вынесен из `DatePicker.showTime`), `ColorPicker` (HSL/alpha на переиспользованном `Slider` + `Popover`, валидируемый hex-input, swatches); data-display `AvatarGroup` (overlap + «+N» overflow), `TreeView` (ARIA tree, roving tabindex + type-ahead, lazy children, controlled-first, RTL), `Calendar` (standalone date-grid, вынесен из `DatePicker`, Monday-first, RTL); layout `Carousel` (peer-free CSS scroll-snap, autoplay c учётом `prefers-reduced-motion`, dots/arrows/keyboard, RTL) и `PanelGroup`/`Panel`/`PanelResizeHandle` (обёртка над `react-resizable-panels` — НОВЫЙ optional peer). `DatePicker` внутренне переписан на композицию нового `Calendar` + `TimePicker` — публичное API не изменилось. Новые хуки из root: `useRovingTabindex`, `useTypeahead`, `useThemeColors`. Завершён отложенный из v1.5 polish: canvas-чарты стали theme-aware (читают палитру из CSS custom properties в момент отрисовки и перерисовываются при смене `data-theme` через `useThemeColors`, с фолбэком на статичную token-палитру), числовые подписи осей/значений форматируются через `Intl.NumberFormat(locale)` из `useLocale()`; `GanttTimeline`-ось зеркалится под `dir="rtl"` (логический `insetInlineStart`); `NotificationCenter`-дропдаун (anchor + unread-badge) использует logical start/end и флипается в RTL, relative timestamps уважают provider-locale; directional-fade офсет `Popover`/`Tooltip` зеркалится для RTL (`directionalFadeVariants(position, dir)`). DevEx: `"sideEffects": false` для tree-shaking (CSS уезжает через отдельный `./tokens`-экспорт); новые ADDITIVE subpath-экспорты `@sagtech-infra/ui/3d` (Network3D/Globe3D/Scene3D/Mindmap3D) и `@sagtech-infra/ui/charts` (12 canvas-чартов) для изоляции тяжёлых семейств; удалены неиспользуемые `apexcharts`/`react-apexcharts` из externals/peer-meta; `size-limit`-баджеты (main/icons/3d/charts) + `pnpm check:size`; новый `.github/workflows/ci.yml` гоняет lint/typecheck/test/build/check:contrast/check:size на push + PR. Tests **438 → 541**.

**Новые компоненты:**

- Form controls: `Switch` (labeled form switch), `Slider` / `RangeInput` (single + two-thumb range, marks, keyboard, RTL, ARIA `slider`), `TimePicker` (standalone hours/minutes, extracted from `DatePicker.showTime`), `ColorPicker` (HSL/alpha via reused `Slider` + `Popover`, validated hex input, swatches).
- Data display: `AvatarGroup` (overlap + «+N» overflow), `TreeView` (ARIA tree, roving tabindex + type-ahead, lazy children, controlled-first, RTL), `Calendar` (standalone date grid extracted from `DatePicker`, Monday-first, RTL).
- Layout: `Carousel` (peer-free CSS scroll-snap, autoplay honoring `prefers-reduced-motion`, dots/arrows/keyboard, RTL), `PanelGroup` / `Panel` / `PanelResizeHandle` (wraps `react-resizable-panels`, a new optional peer).

**Новые хуки (из root):** `useRovingTabindex`, `useTypeahead`, `useThemeColors`.

**Deferred-from-v1.5 polish — закрыто:**

- Canvas-чарты theme-aware: палитра читается из CSS custom properties в момент draw, перерисовка при смене `data-theme` через `useThemeColors`, фолбэк на статичную token-палитру (SSR/tests). Числовые подписи через `Intl.NumberFormat(locale)` из `useLocale()`.
- `GanttTimeline`-ось зеркалится под `dir="rtl"` (логический `insetInlineStart`).
- `NotificationCenter`-дропдаун (anchor + unread-badge) на logical start/end, флипается в RTL; relative timestamps уважают provider-locale.
- `Popover` / `Tooltip` directional-fade офсет зеркалится для RTL (`directionalFadeVariants(position, dir)`).

**DevEx / infra:**

- `"sideEffects": false` — tree-shaking; CSS поставляется через отдельный `./tokens`-экспорт.
- Новые ADDITIVE subpath-экспорты `@sagtech-infra/ui/3d` и `@sagtech-infra/ui/charts` для изоляции тяжёлых семейств (`three`, canvas-чарты). Главный entry по-прежнему ре-экспортирует всё — не breaking.
- Удалены неиспользуемые `apexcharts` / `react-apexcharts` из externals/peer-meta.
- `size-limit`-баджеты (main / icons / 3d / charts) + `pnpm check:size`.
- Новый `.github/workflows/ci.yml`: lint / typecheck / test / build / check:contrast / check:size на push + PR.

---

## 📦 Backlog (без таргета)

Research / wishlist — затаскивается в минор по мере появления реальной потребности у консюмеров.

**Missing primitives:** — всё закрыто в v1.6.

- [x] `Slider` / `RangeInput` — single + two-thumb range, marks, keyboard nav, RTL, ARIA `slider`. ✅ v1.6
- [x] `ColorPicker` — HSL/alpha на переиспользованном `Slider` + `Popover`, валидируемый hex, swatches. ✅ v1.6
- [x] Standalone `TimePicker` — вынесен из `DatePicker.showTime`. ✅ v1.6
- [x] `TreeView` — ARIA tree, roving tabindex + type-ahead, lazy children, controlled-first, RTL. ✅ v1.6
- [x] `ResizableSplitter` / `PanelGroup` — `PanelGroup`/`Panel`/`PanelResizeHandle` поверх `react-resizable-panels` (optional peer). ✅ v1.6
- [x] `Carousel` — peer-free CSS scroll-snap, autoplay (reduced-motion), dots/arrows/keyboard, RTL. ✅ v1.6
- [x] `AvatarGroup` — overlap + «+N» overflow counter. ✅ v1.6
- [x] `Calendar` как самостоятельный примитив — date-grid вынесен из `DatePicker`, Monday-first, RTL. ✅ v1.6
- [x] `Switch` с label-slot. ✅ v1.6

**`RichTextEditor` extensions presets:**

- [x] `createMentionExtension` / `createSlashCommandExtension` + `defaultSlashCommands` / `createImageUploadExtension` + `validateImageFile` — экспортируются из main entry; три новых optional peer'а (`@tiptap/extension-mention`, `@tiptap/suggestion`, `@tiptap/extension-image`). ✅ v1.7
- [x] Syntax-highlight для code-block — `createSyntaxHighlightExtension` (lowlight v3 + `@tiptap/extension-code-block-lowlight`, два новых optional peer'а). ✅ v1.8

**DevEx / infra:**

- [x] **bundle-size budget** (size-limit) — баджеты main/icons/3d/charts, `pnpm check:size`, фейлит CI. ✅ v1.6
- [x] **Tree-shake audit** — `"sideEffects": false` + subpath-экспорты `@sagtech-infra/ui/3d` и `@sagtech-infra/ui/charts` изолируют chart-семейство и 3D-сьют. ✅ v1.6
- [x] **Dynamic peers** — `Network3D`/`Globe3D`/`Scene3D`/`Mindmap3D` lazy-загружают `three`/r3f/drei через `React.lazy` + `<Suspense>` (wrapper/core split); ESM-вход `/3d` больше не тянет peer'ы в статический граф. ✅ v1.8
- [x] **Codemod** для миграций — каркас `scripts/codemod-v2/` (jscodeshift) с рабочим примером `input-externalLabel-to-label` + стабами под v2.0. ✅ v1.8
- **Storybook deploy на GitHub Pages** — отложено сознательно (2026-05-14): приватная либа, узкий круг потребителей, `git clone && pnpm dev` покрывает кейс. Передумаем, если дизайнеры/PM попросят браузер-доступ.

**Server-component (RSC) friendliness:**

- [x] Расщепить `'use client'`-модули на обёртку + чистый тип-экспорт — `Modal`, `Drawer`, `ConfirmDialog`, провайдеры `SagtechUI`/`Theme`/`Locale`/`UIComponents`. RSC могут импортировать типы без client-границы. ✅ v1.7

**Документация:**

- [x] `docs/THEMING.md` — гайд по светлой теме, кастомным темам, токен-маппингу. ✅
- [x] `docs/MOTION.md` — motion-токены, presets, reduced-motion. ✅
- [x] ADR-формат для крупных решений — `docs/adr/` (MADR: README + template + ретроспективные ADR по dark-first токенам, canvas-чартам, optional-peers). ✅ v1.8
