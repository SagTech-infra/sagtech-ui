# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package identity

This repo is published as **`@sagtech-infra/ui`** (not `@sagtech/ui`) to GitHub Packages at `npm.pkg.github.com` under the `@sagtech-infra` scope — see `package.json` and `.npmrc`. Consumers need a `NODE_AUTH_TOKEN` with `read:packages` to install.

Publishing is tag-driven: pushing a `v*.*.*` tag triggers `.github/workflows/publish.yml`, which verifies the tag matches `package.json#version`, then runs `pnpm build && pnpm publish`. Bump the version in `package.json` before tagging — the workflow fails otherwise.

## Commands

Always use `pnpm` (pinned to 10.28.1 via `packageManager`).

| Task | Command |
|---|---|
| Storybook dev server (primary dev UX) | `pnpm dev` — port 6006 |
| Build the library (tsup, ESM+CJS+dts) | `pnpm build` |
| Typecheck only | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Run all tests once | `pnpm test` |
| Watch mode | `pnpm test:watch` |
| Run a single test file | `pnpm test src/components/Form/__tests__/Form.test.tsx` |
| Filter by test name | `pnpm test -t "ref forwarding"` |
| Build static Storybook | `pnpm build-storybook` |

There is no local `dev server for the library itself` — Storybook is the dev harness. The published package contains only `dist/` plus `src/tokens/` (for the `@sagtech-infra/ui/tokens` CSS export).

## Architecture

### Bundling model — tsup with externalized peers

`tsup.config.ts` emits two entry points: `src/index.ts` → `dist/index.{js,cjs,d.ts}` and `src/icons/index.ts` → `dist/icons/index.{js,cjs,d.ts}`, matching the `exports` map in `package.json`.

All React, Next, framer-motion, classnames, and optional peers (swiper, react-hook-form, apexcharts, libphonenumber-js, react-international-phone) are `external`. **When adding a new dependency that should not be bundled into consumer code, add it to both `peerDependencies` and `tsup.config.ts`'s `external` array** — forgetting either leads to duplicate React copies or bundle bloat at the consumer.

### Design tokens — Tailwind v4 `@theme` block

`src/tokens/index.css` bundles `theme.css` + `gradients.css` + `animations.css` + `autofill.css` + `scrollbar.css`. It is exported as `./tokens` (raw CSS, not built) so consumers `@import '@sagtech-infra/ui/tokens'` at the top of their global stylesheet.

`theme.css` is the **single source of design truth**: colors (`black_1..4`, `white_1..4`, `grey_1..4`, `pr_purple`, `sec_purple`, `pr_blue`, `sec_blue`, `error`/`warning`/`success`), spacing (`*px` named scale, e.g. `--spacing-24px`), breakpoints (`ls/es/xs/mds/sm/sl/xl/md/lg/2xl/xh/3xl`), fonts (`--font-orbitron|roboto|manrope`), radii, shadows. Components use these tokens via Tailwind utility classes (`bg-black_1`, `p-24px`, `rounded-24px`, etc.) — avoid hardcoded hex/px values.

Design intent is **dark-mode only** — there are no light-mode token equivalents.

### Next.js externalization — two layers

Some components import `next/image`, `next/link`, or `next/dynamic` directly; others go through a runtime injection layer. Both paths must keep working.

1. **Build-time external + Storybook mocks.** tsup treats `next/*` as external, so the bundle leaves those imports intact. For the Storybook harness (non-Next project) and Vitest, `.storybook/main.ts` aliases `next/image` → `./mocks/next-image.tsx`, `next/link` → `./mocks/next-link.tsx`, `next/dynamic` → `./mocks/next-dynamic.tsx`. When you add a component that imports a new `next/*` module, add a matching mock here.
2. **Runtime injection via `SagtechUIProvider`.** `src/providers/` exposes `SagtechUIProvider` with `imageComponent` / `linkComponent` props (defaults to `<img>` / `<a>` shims). Components that want to stay framework-agnostic call `useImageComponent()` / `useLinkComponent()` instead of importing `next/image` or `next/link`. Prefer this pattern for new components so non-Next consumers don't need path aliases.

Non-Next consumers must alias `next/image`, `next/link`, `next/dynamic` to shims OR use `SagtechUIProvider` — the README/user-global instructions describe the aliasing approach.

### Component folder convention

A component lives at `src/components/<Name>/` and typically contains:

- `<Name>.tsx` — the component, usually with `'use client'` at the top since most are interactive
- `<Name>.stories.tsx` — Storybook stories (discovered by glob `../src/**/*.stories.@(ts|tsx)`)
- `types.ts` — shared types when they'd clutter the main file
- `use<Name>Styles.ts` or `<name>.const.ts` — style/constant extraction
- `index.ts` — barrel for compound components (Form, Toast, Confirm, DataTable)
- `__tests__/<Name>.test.tsx` — colocated tests

All public exports flow through `src/index.ts`. Adding a component means:
1. Build it under `src/components/<Name>/`
2. Add the export line(s) to `src/index.ts` (grouped by category: Foundations / Form Controls / Layout / Data Display / Feedback)
3. Write a `.stories.tsx`
4. Add tests under `__tests__/` if behavior is non-trivial

### Compound-component pattern

`Confirm`, `Form`, `Toast`, and `DataTable` are folders with a barrel `index.ts` that re-exports multiple pieces (provider + hook + component + types). Re-export these through `src/index.ts` as a group rather than one-by-one from the folder.

### Testing

- Vitest with `happy-dom` (faster than jsdom, but less complete — watch for missing DOM APIs).
- `@testing-library/jest-dom/vitest` matchers are loaded in `vitest.setup.ts`.
- **`framer-motion` is globally mocked** in `vitest.setup.ts` to pass-through primitives because happy-dom doesn't reliably fire `transitionend`, which would leave `AnimatePresence` exit-animated nodes stuck in the DOM. If you write a test and an element that should be unmounted is still present, this mock is why — assert on logical state (e.g., `queryByRole` returning null after a close handler fires) rather than animation completion.
- Path alias `@/*` → `src/*` is set in both `vitest.config.ts` and `tsconfig.json`.
- `src/__tests__/refForwarding.test.tsx` is a cross-cutting suite that asserts specific form controls forward refs to the expected underlying element — keep it in sync when touching `forwardRef` in any form control.

### tsconfig quirk

`ignoreDeprecations: "6.0"` is set because the repo uses TypeScript 6.0.2. Don't remove it without verifying the build still passes — TS 6 deprecated several options that this config still relies on.
