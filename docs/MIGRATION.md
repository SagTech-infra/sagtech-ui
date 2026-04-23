# Migration notes

## Package name — `@sagtech-infra/ui` (final)

Пакет опубликован в GitHub Packages как **`@sagtech-infra/ui`**. Некоторые потребители исторически импортируют его как `@sagtech/ui` через локальный `file:`-alias в их `package.json` / `tsconfig.json`. **Для новых проектов используйте официальное имя.**

Существующим потребителям (`admin-fe`, `customer-fe`, `posting-hub`, `lead-gen-tool/fe-next`, `smg-frontend-new`, `landing-*`):

- Пока проект установлен через `file:../sagtech-ui` или `workspace:*` — alias `@sagtech/ui` работает.
- При первом публичном релизе (bump до `0.2.0`+ и публикация на `npm.pkg.github.com`) потребителям нужно:

```diff
 // package.json
 "dependencies": {
-  "@sagtech/ui": "file:../sagtech-ui"
+  "@sagtech-infra/ui": "^0.2.0"
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

### 0.2.0 (upcoming)

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
