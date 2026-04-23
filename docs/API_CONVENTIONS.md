# API Conventions

Правила именования и формы API для новых и эволюционирующих компонентов библиотеки.

## Callback props

| Сценарий | Имя | Сигнатура | Примеры |
|---|---|---|---|
| Изменение контролируемого значения | `onChange` | `(next: T) => void` или native `ChangeEventHandler` | Input, TextArea, Toggle, Checkbox, RadioGroup, DatePicker, TagInput, Combobox |
| Выбор элемента с закрытием меню | `onSelect` | `(item: T) => void` | DropdownMenu items |
| Клик по кнопке/action | `onClick` | `MouseEventHandler` | Button, DropdownMenu item.onClick |
| Открытие/закрытие overlay | `onOpenChange` | `(open: boolean) => void` | ConfirmDialog |
| Close-only | `onClose` | `() => void` | Drawer, Modal (через `toggle`), Alert.onClose |
| Множественная загрузка файлов | `onFilesAdd` + `onFileRemove` + `onFileRetry` | см. FileDropzone | FileDropzone |
| Реордер коллекции | `onReorder` | `(nextItems: T[]) => void` | SortableList |
| Drop-шаблон (одноразовое действие) | `onDrop` | `(files: File[]) => void` | Dropzone |
| Complete-событие в многошаговом flow | `onComplete` | `() => void` | useWizard |
| Подтверждение с возможностью отмены | `onConfirm` | `() => void \| Promise<void>` — вернуть promise чтобы дисейблить UI до разрешения | ConfirmDialog, Wizard.Footer.onNext |

## Legacy-разногласия

Некоторые существующие компоненты расходятся с конвенцией. Изменение = breaking, поэтому оставлены как есть с deprecated-алиасами:

- **`SelectInput`** — `onSelect` помечен `@deprecated`; новый путь `onChange`.
- **`Attachment`** — `onUpload` (custom) вместо `onChange`. Обозначен как legacy-компонент; для новых полей предпочтительнее `FileDropzone`.

При создании новых компонентов следуйте таблице выше — не плодите custom-имена без нужды.

## Value props

- Контролируемое значение: `value` (+ `onChange`).
- Значение по умолчанию для uncontrolled: `defaultValue`.
- Boolean-состояния: `disabled`, `loading`, `required`, `error` (boolean). Для text ошибки используйте `errorMessage`.

## Labels и a11y

- Label над input-ом: `label?: string` (рендерит `<Typography tag="label">` с `htmlFor`, если применимо). Для трёх legacy-компонентов (`Input`, `PhoneInput`, `Dropzone`) оставлено `externalLabel` до унификации — новые компоненты используют `label`.
- Hint/help-text: `hint?: string` (под контролом, `text-grey_2`).
- Для ошибок: `error?: boolean` + `errorMessage?: string`. `aria-invalid` и `aria-describedby` проставляются автоматически.

## Size / variant

- Размеры: `size?: 'sm' | 'md' | 'lg'` (добавляйте 'xl'/'full' только когда реально нужно).
- Цветовые варианты: `variant?: 'primary' | 'secondary' | 'danger' | ...` — варианты определяются семантикой, не цветом (не `variant="purple"`).

## Compound-компоненты

Для сложных составных компонентов (Form, Wizard, Tabs) экспортируйте namespace-объект: `Wizard.Root`, `Wizard.Progress`, `Wizard.Content`, `Wizard.Footer`. Hook-версия (`useWizard()`) даётся параллельно — для кастомных раскладок.

## Imperative API (Toast, Confirm, CommandPalette)

Imperative-API предпочтительно строить через `Provider` + `use*()` hook:

```tsx
<ConfirmProvider>
  <App />
</ConfirmProvider>

const confirm = useConfirm();
const ok = await confirm({ title: '...', variant: 'danger' });
```

Альтернативно — глобальный API через store (как `toast`), если provider не уместен.

## Ref forwarding

Все interactive-компоненты (Input, TextArea, Button, Modal, Drawer, etc.) должны поддерживать `ref` к корневому DOM-элементу — чтобы `react-hook-form.register().ref`, focus management и libraries like floating-ui работали.
