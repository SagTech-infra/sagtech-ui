import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      // Enforced as a regression ratchet from v1.9 (thresholds set just below the
      // measured numbers — see below). They are deliberately not high: canvas
      // charts (LTR geometry, smoke-only by ADR-0002) and the VirtualList /
      // VisualGraphEditor / RichTextEditor geometry/pointer/ProseMirror paths are
      // verified in a real browser by Playwright CT (`pnpm test:ct`), a separate
      // layer NOT merged into this v8 report — so they read as partially covered
      // here. The 3D *Core files are excluded outright: they only render WebGL
      // peers that are mocked to no-ops in happy-dom, so their coverage is noise.
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/index.ts',
        'src/tokens/**',
        'src/**/*.d.ts',
        'src/components/**/*Core.tsx',
      ],
      thresholds: {
        statements: 55,
        branches: 72,
        functions: 53,
        lines: 55,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
