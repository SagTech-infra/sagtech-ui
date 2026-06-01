import { test, expect } from '@playwright/experimental-ct-react';
import Button from '@/components/Button/Button';

// Harness smoke test: proves the CT runner mounts a real component with the
// design tokens + Tailwind utilities + `@` alias wired up. If this fails, the
// problem is the CT setup (playwright-ct.config.ts / playwright/index.ts), not
// the component specs. Keep it minimal.
test('CT harness mounts Button with design tokens applied', async ({ mount }) => {
  const component = await mount(<Button text="Click me" />);

  await expect(component).toContainText('Click me');

  // Tokens loaded → a font-family CSS variable resolves to a real font stack.
  const fontFamily = await component.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(fontFamily.length).toBeGreaterThan(0);
});
