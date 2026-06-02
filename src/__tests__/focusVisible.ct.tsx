import { test, expect } from '@playwright/experimental-ct-react';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import SelectFakeInput from '@/components/SelectInput/SelectFakeInput';

// Real-browser companion to focusVisible.test.tsx. The happy-dom guard only
// asserts the `focus-visible:ring-*` class strings are present; here we confirm
// the ring actually RENDERS as a box-shadow under :focus-visible (keyboard focus)
// — something happy-dom, with no layout/style engine, cannot verify.
const boxShadow = (el: Element) => getComputedStyle(el).boxShadow;
const PR_PURPLE = '109, 62, 241'; // pr_purple #6D3EF1 — the ring colour

test.describe('focus-visible ring — real-browser rendering', () => {
  test('Button renders the purple ring on keyboard focus', async ({ mount, page }) => {
    // Wrap so the mount root is a div and getByRole finds the button as a
    // descendant (Button's own root element IS the <button>).
    const c = await mount(
      <div>
        <Button variant="primary" text="Click me" />
      </div>,
    );
    const btn = c.getByRole('button');

    await page.keyboard.press('Tab'); // keyboard → :focus-visible matches
    await expect(btn).toBeFocused();
    const shadow = await btn.evaluate(boxShadow);
    expect(shadow).not.toBe('none');
    expect(shadow).toContain(PR_PURPLE);
  });

  test('Input renders a ring on keyboard focus', async ({ mount, page }) => {
    const c = await mount(<Input placeholder="test" />);
    const input = c.getByRole('textbox');

    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
    expect(await input.evaluate(boxShadow)).not.toBe('none');
  });

  test('SelectFakeInput renders a ring on keyboard focus', async ({ mount, page }) => {
    const c = await mount(
      <SelectFakeInput onClick={() => {}} displayValue="" placeholder="Select…" isOpen={false} />,
    );
    const combo = c.getByRole('combobox');

    await page.keyboard.press('Tab');
    await expect(combo).toBeFocused();
    expect(await combo.evaluate(boxShadow)).not.toBe('none');
  });
});
