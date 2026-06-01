# codemod-v2 — `@sagtech-infra/ui` v2.0 migration codemods

> These transforms automate the **v2.0 breaking-cleanup** renames and removals.
> They are **best-effort**: each automates the mechanically-safe rewrite and
> inserts a banner comment flagging the cases it cannot safely handle (structural
> migrations, dynamic values, ambiguous props). Run them **once** against a
> **clean git tree**, always preview with `--dry --print` first, then resolve any
> flagged comments by hand. See `docs/MIGRATION.md` (v1.9 → v2.0) for before/after.
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

| Name | Automates | Flags for manual review |
|---|---|---|
| `input-externalLabel-to-label.ts` | `<Input>`/`<PhoneInput>` `externalLabel`→`label`; Input floating `label`→`floatingLabel` (only when `externalLabel` is present, so it's idempotent) | ambiguous `<Input label>`-only usages (could be old floating or new static) |
| `attachment-onUpload-to-onChange.ts` | `<Attachment>` `onUpload`→`onChange` — pure rename, identical signature | — |
| `selectInput-onSelect-to-onChange.ts` | `onSelect`→`onChange` when no sibling `onChange` | `onSelect`+`onChange` clashes; `register`/`name` (rewire to controlled) |
| `tabs-defaultIndex-to-defaultValue.ts` | numeric literal `defaultIndex={N}`→`defaultValue="tab-N"` | dynamic (non-literal) `defaultIndex` |
| `remove-notification-family.ts` | strips the four removed imports (by exact name) | remaining usages → migrate to `Toast` (provider→imperative) |

Notes:

- **Best-effort + flagging policy.** Structural migrations cannot be fully
  automated. Where a transform can't safely rewrite, it leaves the source intact
  and prepends a banner comment (`codemod-v2: …`) describing the manual step.
  Search for `codemod-v2:` after running.
- `input-externalLabel-to-label` rewrites an `<Input>` only when it still carries
  the unambiguous `externalLabel`, renaming the floating `label`→`floatingLabel`
  first, then `externalLabel`→`label`. This keeps it safe to run more than once.
- `remove-notification-family` matches the four removed symbols by **exact name**,
  so `NotificationCenter` (a separate, non-deprecated component) is never touched.

## Fixtures

`__testfixtures__/` holds `<name>.input.tsx` / `<name>.output.tsx` pairs that
demonstrate (and let you verify) every transform — including scoping guards
(e.g. `externalLabel` / `onUpload` on a non-target component is left unchanged)
and the flagged branches. Re-run a transform on its `.input.tsx` with
`--dry --print` to confirm the output matches the `.output.tsx`.

## See also

- [`docs/MIGRATION.md`](../../docs/MIGRATION.md) — the human migration guide
  (deprecations, replacements, timelines).
- [`docs/ROADMAP.md`](../../docs/ROADMAP.md) — the **✅ v2.0 — released** section
  summarising every removal.
- [`docs/adr/0006-v2-breaking-cleanup-window.md`](../../docs/adr/0006-v2-breaking-cleanup-window.md)
  — the decision record for the breaking window.
