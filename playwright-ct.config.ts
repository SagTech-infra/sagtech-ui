import { defineConfig, devices } from '@playwright/experimental-ct-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Playwright Component Testing — runs the three geometry/pointer/ProseMirror
 * components in a real Chromium so we can cover what happy-dom physically
 * cannot (scroll windowing, pointer-drag, paste/drop, suggestion popovers).
 *
 * Deliberately separate from `vitest.config.ts`:
 *   - matches only `*.ct.tsx`, so `vitest` (`*.test.{ts,tsx}`) never picks these
 *     up and CT never picks up the happy-dom suite;
 *   - NOT wired into `pnpm test` or `ci.yml` — the browser binaries are ~300MB
 *     and would slow every PR. Run locally via `pnpm test:ct` (see ADR-0004).
 *
 * `ctViteConfig` reuses the Storybook/Vitest environment (Tailwind v4 plugin,
 * `@` alias, next/* mocks) so mounted components are styled exactly as shipped.
 */
export default defineConfig({
  testDir: './src',
  testMatch: '**/*.ct.tsx',
  snapshotDir: './playwright/__snapshots__',
  timeout: 20_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : [['list']],
  use: {
    trace: 'on-first-retry',
    ctPort: 3110,
    ctViteConfig: {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          'next/image': path.resolve(__dirname, './.storybook/mocks/next-image.tsx'),
          'next/link': path.resolve(__dirname, './.storybook/mocks/next-link.tsx'),
          'next/dynamic': path.resolve(__dirname, './.storybook/mocks/next-dynamic.tsx'),
        },
      },
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
