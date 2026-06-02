# Choosing between similar components

Несколько компонентов в библиотеке имеют пересекающуюся семантику. Шпаргалка, чтобы не выбрать не тот.

## `Dropzone` vs `Attachment` vs `FileDropzone`

| Компонент | Когда использовать | Визуал |
|---|---|---|
| **`Attachment`** | Одиночное поле в форме вида «Attach file» — компактная кнопка рядом со стандартными input'ами. Для бэкенд-интеграции с `FormData` в классическом RHF-контексте. | Маленький трейл «paperclip + file name». Выглядит как inline-input. |
| **`Dropzone`** | Drop-зона, отдающая массив `File[]` в родителя. Консьюмер сам управляет upload-логикой и списком загруженных. Пригоден, когда upload instant/offline (exports, parsers, CSV import). | Прямоугольная пунктирная зона с иконкой облака + «Drag & drop». |
| **`FileDropzone`** | Upload-widget с preview для картинок, прогрессом per-file, retry при ошибке, лимитом файлов. Используйте, когда upload идёт асинхронно и каждая позиция имеет свой статус. | То же что Dropzone, но внизу список карточек с превью/прогрессом/статусом. |

**Практически:** если в дизайне есть прогресс-бар под файлом — берите `FileDropzone`. Если нет, и файл отправляется в общий `multipart/form-data` вместе с формой — `Attachment`. Если нужна зона без preview (CSV importer) — `Dropzone`.

## `Tabs` vs `InfoTabs`

| Компонент | Когда использовать | Визуал |
|---|---|---|
| **`Tabs`** | Навигация по секциям одной страницы (Overview / Activity / Settings). Контролирует active-state, рендерит content через children. | Горизонтальная лента underline-подчёркиваний. |
| **`InfoTabs`** | Маркетинговый виджет «вкладки с пояснительными блоками» для landing-страниц. Подходит для «Features / Benefits / FAQ»-раскладок. Не рекомендуется как admin-навигация. | Карточки с иконками, разбитые на колонки. |

**Практически:** для in-app навигации всегда `Tabs`. `InfoTabs` — только для marketing/landing-контекста.

## `Modal` vs `Drawer` vs `CommandPalette`

| Компонент | Когда использовать |
|---|---|
| **`Modal`** | Короткое действие, требующее подтверждения или формы с обязательным фокусом (delete confirm, edit profile). Поддерживает stacking через `ModalStack`. |
| **`Drawer`** | Боковая панель, не отрывающая от основного контекста — detail view, bulk edit, filter sidebar. |
| **`CommandPalette`** | Глобальный Cmd+K для быстрой навигации и запуска команд. |

## `Toast` vs `Alert` vs `NotificationCenter`

| Компонент | Когда использовать |
|---|---|
| **`Toast` / `Toaster`** | Короткоживущие (2–5с) сообщения — «Saved», «Copied to clipboard», «Upload failed». Floating в углу экрана, стэкуются. Для imperative `toast.success()`. |
| **`Alert`** | Inline-сообщение в потоке страницы — warnings под формой, rate-limit на дашборде, upgrade-prompts. Persistent (не авто-исчезает). |
| **`NotificationCenter`** | Widget-колокольчик в header'е с историей нотификаций. Prop-driven (консьюмер передаёт `notifications[]` + колбэки). |

> Семейство `Notification` (`Notification` / `NotificationWrapper` / `NotificationContext` / `NotificationContextProvider`) **удалено в v2.0** — используйте `Toaster` + `toast`. См. `docs/MIGRATION.md`.

## `SelectInput` vs `Combobox`

| Компонент | Когда использовать |
|---|---|
| **`SelectInput`** | Короткий фиксированный список опций (status enum, theme variant). Поддерживает multi-select через `multiple={true}`. |
| **`Combobox`** | Длинный список (>20), async-loading, custom rendering per option. Есть встроенный search внутри дропдауна. |

## `Confirm` vs `ConfirmWithNote` vs ручная `Modal`

- `useConfirm()` — простое Yes/No подтверждение.
- `useConfirmWithNote()` — то же, но пользователь должен ввести причину (reject timesheet with reason).
- Ручная `Modal` — для всего, где нужна форма с валидацией, несколькими полями, wizard-flow-ом.

## `EmptyState inline` vs `EmptyState card`

- `variant="inline"` — когда родительский контейнер уже имеет фон/рамку (внутри Modal, внутри CardWrapper).
- `variant="card"` — когда empty-state рендерится на голой странице (страница /projects без проектов).

---

## v1.1 additions

### `Sheet` vs `Drawer` vs `Modal` vs `BottomSheet`

| Component | Use it when |
|---|---|
| **`Modal`** | A focused, blocking dialog where the user must complete or dismiss before continuing — delete confirms, edit-profile forms, paywalls. Also for any flow that genuinely needs a centred dialog. |
| **`Drawer`** | A single side panel (`left`/`right`) for detail views or filter sidebars. Lighter than Sheet, no built-in stacking discipline. Existing v1.0 component, kept unchanged. |
| **`Sheet`** | A side panel that needs to **stack with other sheets / modals** via `ModalStack` — multi-level drilldowns, "open detail panel from inside an open modal", nested overlays. Also when you want the same panel UX from any of four sides (left/right/top/bottom). |
| **`BottomSheet`** | Mobile-first bottom drawer with **drag-to-dismiss** and **multi-snap-points** (peek / half / full). Use for mobile action sheets, filter sheets, "more options" surfaces. |

**Practically:** if you're building a single sidebar in v1.0 code and it works — keep `Drawer`. If you have nested overlays or a flow that opens a panel from another modal — switch to `Sheet`. For mobile bottom UX — `BottomSheet`.

### `Banner` vs `Alert` vs `CookieBanner`

| Component | Use it when |
|---|---|
| **`Alert`** | Inline status message embedded in a layout — warnings under a form, rate-limit notice on a dashboard card, upgrade-prompt inside a section. Stays in document flow. New in v1.1: optional `autoDismiss` for time-bounded notices that should disappear without user action. |
| **`Banner`** | **Page-level sticky persistent message** (`position: 'top' \| 'bottom'`) — system-status announcements, trial-expiring warnings, "you are viewing as another user". Anchored to viewport, stays visible across scroll, has its own `--z-banner` token. |
| **`CookieBanner`** | Legal / cookies-only — purpose-built for the GDPR-style accept/decline flow with local-storage persistence. v1.1 adds `position?` and `children?` slot for custom legal copy. |

### `Network3D` vs `VisualGraphEditor`

- **2D editable graph (xyflow)** → `VisualGraphEditor`. Drag-to-edit, custom node types, edge handles, minimap. Best when the graph is the workflow product (workflow editors, automation builders).
- **3D force-directed view-only** → `Network3D`. Spatial exploration of relationships, large connected datasets, knowledge maps. Backed by `react-force-graph-3d` (optional peer).

They serve different jobs — pick the one that matches the task, not the one that "looks fancier".

### `Stepper` vs `Steps`

- **`Steps`** (v1.0) — simple numbered indicator with animated progress line. Presentational only, no per-step state.
- **`Stepper`** (v1.1) — richer indicator with per-step `status: 'pending' \| 'active' \| 'complete' \| 'error'`, optional `description`, and click-to-jump (`clickableSteps: 'all' \| 'completed' \| 'none'`). Supports both `horizontal` and `vertical` orientation. Use when steps can fail, can be revisited, or need supplementary text per step.

### `Toast` (the transient-feedback API) — `Notification` removed in v2.0

`Notification`, `NotificationWrapper`, `NotificationContext`, `NotificationContextProvider` were `@deprecated` since v1.1 and are **removed in v2.0**. Use `Toaster` + the imperative `toast.success()` / `toast.error()` / `toast.info()` / `toast.warning()` / `toast.loading()` / `toast.promise()` API. See `docs/MIGRATION.md` (v1.9 → v2.0).
