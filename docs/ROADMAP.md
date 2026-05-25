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

---

## ✅ v1.2 — released 2026-05-14

**Fixes / additive (no breaking):**

- `DatePicker` — popover renders into `document.body` via Portal so it escapes `overflow:hidden` ancestors (e.g. `CardWrapper`). Viewport-relative positioning with auto flip-up when there's no room below; re-positions on scroll/resize.
- `GaugeChart` — new `showRange?: boolean` (default `true`) to hide the min/max tick labels at the ends of the arc.
- `RichTextEditor` — pass `immediatelyRender: false` to Tiptap v3's `useEditor` to silence the SSR warning; first render deferred to the client.

**Tests**: 164/164 (unchanged in this release).

---

## ✅ v1.3 — released 2026-05-25

Аддитивный релиз, заложил фундамент motion-системы под светлую тему/motion v1.4. Никаких breaking changes.

**Motion-токены:**

- `theme.css` — группа `--motion-duration-fast/normal/slow` (120/200/320ms) + `--motion-ease-standard/emphasized/decelerated` (cubic-bezier); `scripts/generate-tokens.mjs` эмитит `tokens.motion.*` + тип `MotionToken`.
- Новый хук `src/hooks/useMotion.ts`: `useOverlayTransition(speed, ease)` и `useSpringTransition()` (числовые значения для framer-motion, т.к. `duration` хочет секунды, а не CSS-var) + `MOTION_SPRING`, плюс общие `dropdownVariants` / `positionVariants`. Реэкспорт из `@/hooks` и публичного API.

**Overlay-моции на токены + `prefers-reduced-motion`:**

- `Toast` / `Popover` / `Tooltip` / `ConfirmDialog` / `ConfirmWithNoteDialog` / `DatePicker` / `DateRangePicker` / `SelectDropdownLayout` → `useOverlayTransition('fast')`; `Drawer` / `Sheet` / `BottomSheet` → backdrop `'normal'` + panel `useSpringTransition()`; `Modal` (CSS `.modalAnim`) → motion-токены + `@media (prefers-reduced-motion: reduce)` гард.
- Все overlays честят reduced-motion (мгновенный переход) через `useReducedMotion()`.
- Консолидированы дубли: `motionVariants` (Popover≡Tooltip) → общий `positionVariants`; `dropdownVariants` (DatePicker/DateRangePicker) → общий.

**Polish:**

- `Tabs` — controlled-first `value` + `onValueChange` (index-based); `defaultIndex` / `onChange` помечены `@deprecated` (рабочие до v2.0). См. `docs/API_CONVENTIONS.md`.
- `Button` — обёрнут в `forwardRef<HTMLButtonElement>` (phase 2 of B-6); покрыт в `refForwarding.test.tsx`.
- `SelectDropdownLayout` — хардкод `bg-[#1B1B27]` → новый токен `--color-black_1_5` → `bg-black_1_5`.

**Тесты**: 164 → 190 (+26): smoke для `Sheet` / `BottomSheet` / `Banner` / `Spotlight` / `FAB` / `Modal`, controlled-`Tabs`, Button ref. Мок framer-motion в `vitest.setup.ts` дополнен `useReducedMotion` / `useMotionValue`.

---

## 🎯 v1.4 — light theme + motion presets

Большая аддитивная фича. Не breaking — старые консюмеры остаются на dark по умолчанию.

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

## 🎯 v1.5 — coverage push + a11y / i18n polish

- **Render-smoke тесты для долгого хвоста.** `VirtualList` (IntersectionObserver / ResizeObserver моки в `vitest.setup.ts`), `RichTextEditor` (ProseMirror happy-dom mocks), `VisualGraphEditor` (ReactFlow моки). Альтернатива — Playwright component-tests против Storybook (опциональный путь).
- **Canvas-чарты smoke** — 10 чартов v1.1 (`AreaChart`, `BarChart`, `HeatmapChart`, `RadarChart`, `ScatterChart`, `GaugeChart`, `SankeyChart`, `FunnelChart`, `SparklineChart`, `TreemapChart`) получают mount-смоук + проверку отрисованных props. Глубже не лезем — canvas-снапшоты ненадёжны в happy-dom.
- **3D-suite smoke.** Моки `three` / `@react-three/fiber` / `react-force-graph-3d`, рендер пустых сцен без падений (`Network3D`, `Globe3D`, `Scene3D`, `Mindmap3D`).
- **i18n hooks для дат/времени.** `DatePicker` / `DateRangePicker` / `GanttTimeline` — weekdays/months через `Intl.DateTimeFormat` вместо констант. Локаль из `ThemeProvider` или нового `LocaleProvider`.
- **RTL audit.** Overlays и form-controls под `dir="rtl"` — починить асимметричные паддинги/иконки/выравнивания.
- **Storybook a11y addon** (локально, без деплоя) — `@storybook/addon-a11y`, прогон по существующим сторям.

---

## ⚠️ v2.0 — breaking cleanup + component expansion

Большой мажор из двух частей: закрываем накопленные breaking-changes **и** добавляем curated-слой компонентов, портированных «под наш лад» из соседнего `solution-generator` (`ui-showcase`, 282 компонента в Aceternity/MagicUI-стиле). Слой строится на motion-токенах (v1.3) и семантических/light-токенах (v1.4) + честит `prefers-reduced-motion`, поэтому идёт после v1.5.

### Part A — Breaking cleanup

Все накопленные breakings одним окном. Каждый пункт сопровождается before/after migration-хинтом; итоговая полная миграция уедет в `docs/MIGRATION.md` при релизе.

- **Удалить `Notification` family** (`Notification`, `NotificationContext`, `NotificationContextProvider`, `NotificationWrapper`). Депрекация объявлена в v1.1.
  - _Migration_: переход на `Toast` + `Toaster` (см. `docs/COMPONENT_PICKER.md`). `useContext(NotificationContext)` → `toast.success(...)` / `toast.error(...)`.
- **Унификация `label` prop.** `Input` / `PhoneInput` / `Dropzone` сейчас принимают `externalLabel`. Канон — `label`.
  - _Migration_: переименовать prop. Кандидат на codemod.
- **`Attachment.onUpload` → `onChange`.**
  - _Migration_: переименовать колбэк, сигнатура идентична (`(files: File[]) => void`).
- **`SelectInput.onSelect` удаляется** (уже `@deprecated`).
  - _Migration_: `onSelect={fn}` → `onChange={fn}`.
- **`Tabs.defaultIndex` удаляется** (после v1.3 депрекации).
  - _Migration_: `defaultIndex={1}` → `value` (controlled) или `defaultValue` (uncontrolled, новый API после v1.3).
- **Аудит остальных callback-имён** против `docs/API_CONVENTIONS.md` — любые оставшиеся `onUpload` / `onSelect` / `onSubmitForm` к канону.
- **Removed**: `src/r3f.d.ts`, если к v2.0 уже на r3f@9 (нативный bridge — см. internal sweep 2026-05-05).
- **Codemod-скрипт** в `scripts/codemod-v2/` (jscodeshift) для автомиграции переименований. Публикуется в release notes.

### Part B — Component expansion (порт из `solution-generator`)

Curated best-of (~33 компонента) из `ui-showcase` — переписываем «под наш лад»: на нашем стеке (framer-motion / three / canvas), с перекрасом дефолтной Aceternity-палитры (indigo/violet/slate) в наши токены (`pr_purple`, `sec_purple`, `pr_blue`, `black_1..4`), наши радиусы/шрифты. Не копируем дословно. Источник в таблицах — путь внутри `solution-generator/src/components/`. Релизим волнами A→D.

**Сознательно НЕ берём:** recharts-чарты (`AreaChart`/`BarChart`/`LineChart`/`DonutChart`/`FunnelChart`/`RadialChart` и т.д.) — у нас уже есть свой canvas-чарт-сьют (v1.1), два движка дублируют друг друга.

#### Wave A — Form-примитивы (закрывают backlog-пробелы)

| Новый компонент | Источник | На чём строим / переиспользуем |
|---|---|---|
| `Slider` / `RangeInput` | `ui/slider` | native range + framer-motion; single + range, ticks/marks, keyboard nav (backlog-пункт) |
| `ColorPicker` | `forms/color-picker` | HSL/hex, swatches, alpha + наши токены (backlog-пункт) |
| `PinInput` (OTP) | `forms/PinInput` | controlled-инпуты, паттерн `Input` |
| `CurrencyInput` | `forms/CurrencyInput` | `Intl.NumberFormat` |
| `QuantityStepper` | `forms/QuantityStepper` | наш `Button` (отличать от wizard-`Stepper`) |
| `AvatarGroup` | `layout/AvatarCircles` | наш `Avatar` + overflow-counter |
| `RatingInput` | `forms/Rating` | расширить наш read-only `Rate` до интерактивного |

#### Wave B — Фоны и эффекты

| Новый компонент | Источник | На чём строим |
|---|---|---|
| `AuroraBackground` | `backgrounds/aurora-background` | CSS + framer-motion |
| `BackgroundBeams` | `backgrounds/background-beams` | SVG + framer-motion |
| `Particles` | `backgrounds/Particles` | **новый optional peer** `@tsparticles/*` |
| `Meteors` | `backgrounds/Meteors` | CSS / framer-motion |
| `DotPattern` + `GridPattern` | `backgrounds/DotPattern`, `AnimatedGridPattern` | SVG (дёшево, высокий reuse) |
| `SpotlightBackdrop` | `backgrounds/spotlight-new` | **переименован** — `Spotlight` уже занят product-tour компонентом |
| `AnimatedBeam` | `effects/AnimatedBeam` | SVG + framer-motion (соединяет DOM-узлы по ref) |
| `BorderBeam` / `ShineBorder` | `effects/BorderBeam`, `ShineBorder` | CSS / framer-motion |
| `DottedMap` | `effects/DottedMap` | **новый optional peer** `svg-dotted-map` |
| `OrbitingCircles` + `IconCloud` | `animation/OrbitingCircles`, `layout/IconCloud` | CSS / cobe-стиль |

#### Wave C — Текст и скролл-анимации

| Новый компонент | Источник | На чём строим |
|---|---|---|
| `TypewriterText` | `text-effects/typewriter-effect` | framer-motion |
| `FlipWords` | `text-effects/flip-words` | framer-motion |
| `TextGenerateEffect` | `text-effects/text-generate-effect` | framer-motion |
| `AnimatedNumber` | `text-effects/animated-number` | framer-motion |
| `SparklesText` | `text-effects/sparkles` | canvas / SVG |
| `Marquee` | `animation/Marquee` | CSS |
| `InfiniteMovingCards` | `animation/infinite-moving-cards` | framer-motion |
| `BlurFade` + `ScrollReveal` | `animation/BlurFade`, `ScrollReveal` | framer-motion (+ optional `lenis` SmoothScroll) |

#### Wave D — Карточки, кнопки, лэйаут

| Новый компонент | Источник | На чём строим |
|---|---|---|
| `BentoGrid` | `layout/BentoGrid` | CSS grid |
| `TiltCard` | `cards/TiltCard` | framer-motion (mouse-tilt) |
| `MagicCard` | `layout/MagicCard` | framer-motion (spotlight-on-hover) |
| `GlareCard` / `WobbleCard` | `cards/glare-card`, `cards/wobble-card` | CSS / framer-motion (взять 1-2) |
| `ShimmerButton` | `buttons/ShimmerButton` | CSS-анимация |
| `HoverBorderGradient` | `buttons/hover-border-gradient` | framer-motion |
| `FloatingDock` | `layout/floating-dock` | framer-motion (macOS-dock) |
| `Compare` | `layout/compare` | framer-motion (before/after slider) |
| `HeroVideoDialog` | `layout/HeroVideoDialog` | наш `Modal` |

**Stretch / кандидаты (не headline):** `DataGlobe` (cobe — сверить с нашим `Globe3D`), `TweetCard` (`react-tweet`), `DynamicIsland`, `CalendarHeatmap`, `ProgressRing`, `Bullet`/`TrendArrow`/`KpiCard`, `macbook-scroll`.

#### Архитектурные требования к Part B

- **Новые optional peers** (`@tsparticles/engine`+`react`+`slim`, `svg-dotted-map`, опц. `cobe`/`lenis`/`embla-carousel-react`/`react-tweet`): добавить в **`peerDependencies` И в `external` массив `tsup.config.ts`** (правило из `CLAUDE.md`), `peerDependenciesMeta.optional = true`, плюс `declare module` в `src/css.d.ts` для их CSS-импортов. Runtime-assert + раздел Peer dependencies в README.
- **Токены/тема:** компоненты пишутся на семантические токены v1.4 (`var(--bg-*)`, `var(--fg-*)`) и motion-токены v1.3 — не на сырые `black_1..4` напрямую.
- **`prefers-reduced-motion`:** все анимированные компоненты честят `useReducedMotion()` (groundwork v1.3).
- **SSR / `'use client'`:** canvas/WebGL гардят `typeof window`; директива `'use client'` на интерактивных.
- **`src/index.ts`:** новые группы экспорта — `Backgrounds & Effects`, `Motion & Text`; расширить `Form Controls` / `Layout`.
- **Тесты:** mount-smoke (framer-motion уже глобально замокан в `vitest.setup.ts`); для canvas/WebGL — моки canvas / IntersectionObserver / ResizeObserver (тот же подход, что в v1.5).
- **Лицензии:** Aceternity/MagicUI — MIT; `svg-dotted-map`/`cobe`/`lenis`/`embla`/`react-tweet`/`gsap` — MIT/free. Переписываем «под наш лад», не копируем дословно.

---

## 📦 Backlog (без таргета)

Research / wishlist — затаскивается в минор по мере появления реальной потребности у консюмеров.

**Missing primitives:**

- ~~`Slider` / `RangeInput`~~ — **запланировано в v2.0 Wave A** (single + range, ticks, marks, keyboard nav).
- ~~`ColorPicker`~~ — **запланировано в v2.0 Wave A** (HSL/hex, swatches, alpha).
- Standalone `TimePicker` (сейчас встроен в `DatePicker.showTime`).
- `TreeView` — expandable nodes, lazy load children, keyboard nav.
- `ResizableSplitter` / `PanelGroup` — horizontal/vertical, persistence.
- `Carousel` — отдельно от `Timeline` на swiper, без обязательного peer.
- ~~`AvatarGroup`~~ — **запланировано в v2.0 Wave A** (overlapping avatars + overflow counter).
- `Calendar` как самостоятельный примитив (выделить date-grid из `DatePicker`).
- `Switch` с label-slot — если `Toggle` не покрывает кейс (требует confirm).

**`RichTextEditor` extensions presets:**

- Mentions (`@user`), slash-commands (`/heading`), image upload, syntax-highlight для code-block. Сейчас экспортируется только Tiptap StarterKit + точка расширения через prop `extensions`.

**DevEx / infra:**

- Per-component **bundle-size budget** (size-limit / bundlewatch), баджет фейлит CI.
- **Tree-shake audit** — особенно chart-семейство и 3D-сьют, чтобы консюмер платил байтами только за то, что импортирует.
- **Dynamic peers** — lazy-load `three` / `apexcharts` внутри компонента через `next/dynamic` или React `lazy`, уменьшить first-load для не-3D-страниц.
- **Codemod** для миграций (можно завести раньше v2.0 для опытов).
- **Storybook deploy на GitHub Pages** — отложено сознательно (2026-05-14): приватная либа, узкий круг потребителей, `git clone && pnpm dev` покрывает кейс. Передумаем, если дизайнеры/PM попросят браузер-доступ.

**Server-component (RSC) friendliness:**

- Расщепить ещё несколько компонентов на `'use client'`-обёртку + чистый тип-экспорт (как уже сделано для `NotificationContext`). Кандидаты — `Modal` / `Drawer` / `ConfirmDialog` типы и их Provider'ы.

**Документация:**

- `docs/THEMING.md` — гайд по светлой теме, кастомным темам, токен-маппингу.
- `docs/MOTION.md` — motion-токены, presets, reduced-motion.
- ADR-формат для крупных решений (light theme, motion API, bundle-size budget).
