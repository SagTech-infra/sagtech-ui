# codemod-v2 — `@sagtech-infra/ui` v2.0 migration codemods

> 🚧 **SCAFFOLD — NOT FOR PRODUCTION USE UNTIL v2.0.**
> These transforms target API changes scheduled for the v2.0 breaking-cleanup
> release. The library is currently on the v1.x line; **most transforms are
> stubs**. Do not run these against a real codebase yet — the v2.0 API is not
> frozen, and the stubs are intentional no-ops. This directory exists so the
> migration tooling can be designed, reviewed, and tested ahead of v2.0.
>
> This directory is **not published** (`package.json#files` ships only `dist`,
> `src/tokens`, `README.md`, `docs/AI_MIGRATION_PROMPT.md`).

## Prerequisites

- `jscodeshift` and `@types/jscodeshift` are available as devDependencies in
  this repo. For ad-hoc runs you can also use `pnpm dlx jscodeshift`.
- Run against a **clean git working tree** so you can diff and revert.
- Back up / commit before running; codemods rewrite files in place (omit
  `--dry` to actually write).

## Running a transform

The transforms are authored in **TypeScript (`.ts`)**, so jscodeshift must parse
them with the TSX parser. Pass **`--parser=tsx`** explicitly — without it,
jscodeshift's default parser chokes on TS/JSX syntax in both the transform and
the source files.

```bash
pnpm dlx jscodeshift \
  -t scripts/codemod-v2/transforms/<name>.ts \
  <glob> \
  --parser=tsx \
  --extensions=tsx,ts
```

Example (dry-run, prints the result without writing):

```bash
pnpm dlx jscodeshift \
  -t scripts/codemod-v2/transforms/input-externalLabel-to-label.ts \
  "src/**/*.tsx" \
  --parser=tsx --extensions=tsx,ts \
  --dry --print
```

Useful flags:

- `--dry` — do not write changes to disk.
- `--print` — print the transformed source to stdout (pair with `--dry` to
  preview).
- `--extensions=tsx,ts` — process both extensions.

## Transforms

| Name | Target | Status |
|---|---|---|
| `input-externalLabel-to-label.ts` | `<Input externalLabel>` → `<Input label>` | ✅ example (fully implemented + fixtures) |
| `attachment-onUpload-to-onChange.ts` | `<Attachment onUpload>` → `<Attachment onChange>` | ✅ example (implemented; ⚠️ signature differs — verify handlers) |
| `selectInput-onSelect-to-onChange.ts` | `<SelectInput onSelect>` → `onChange` | 🚧 stub |
| `tabs-defaultIndex-to-defaultValue.ts` | `<Tabs defaultIndex>` → `defaultValue` | 🚧 stub |
| `remove-notification-family.ts` | remove `Notification`/`NotificationContext`/`NotificationContextProvider`/`NotificationWrapper` | 🚧 stub |

Notes:

- `attachment-onUpload-to-onChange` renames the prop but the callback signature
  may differ (`Array<File> | undefined` vs a v2.0 value shape) — it emits a
  `console.warn` and **requires manual handler verification**.
- `remove-notification-family` does **not** touch `NotificationCenter`, which is
  a separate, non-deprecated component.

## Fixtures

`__testfixtures__/` holds `<name>.input.tsx` / `<name>.output.tsx` pairs that
demonstrate (and let you verify) a transform. The `input-externalLabel-to-label`
fixtures also show scoping: `externalLabel` on a non-`Input` component is left
unchanged.

## See also

- [`docs/MIGRATION.md`](../../docs/MIGRATION.md) — the human migration guide
  (deprecations, replacements, timelines).
- [`docs/ROADMAP.md`](../../docs/ROADMAP.md) — the **v2.0 — breaking cleanup**
  section listing every scheduled removal.
