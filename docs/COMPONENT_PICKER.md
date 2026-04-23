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

## `Notification` vs `Toast` vs `Alert` vs `NotificationCenter`

| Компонент | Когда использовать |
|---|---|
| **`Toast` / `Toaster`** | Короткоживущие (2–5с) сообщения — «Saved», «Copied to clipboard», «Upload failed». Floating в углу экрана, стэкуются. Для imperative `toast.success()`. |
| **`Notification`** | Legacy компонент — оставлен для backward-compat с `NotificationContext`. В новом коде предпочитайте `Toast`. |
| **`Alert`** | Inline-сообщение в потоке страницы — warnings под формой, rate-limit на дашборде, upgrade-prompts. Persistent (не авто-исчезает). |
| **`NotificationCenter`** | Widget-колокольчик в header'е с историей нотификаций. Prop-driven (консьюмер передаёт `notifications[]` + колбэки). |

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
