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
      // Report-only in v1.8.0: no enforced thresholds. Several components are
      // geometry-heavy (canvas charts, 3D, virtualized lists) and can only be
      // smoke-tested in happy-dom, so a global threshold would be misleading.
      // Revisit per-file thresholds once those move to Playwright CT.
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
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
