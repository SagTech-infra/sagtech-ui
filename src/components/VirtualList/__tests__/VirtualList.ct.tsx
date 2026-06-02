import { test, expect } from '@playwright/experimental-ct-react';
import { VirtualListFixture } from './VirtualList.fixtures';

// Real-browser coverage for behaviour happy-dom cannot reach (see the NOTE in
// VirtualList.test.tsx): scroll-driven windowing and measureElement remeasure.
// happy-dom reports a zero-height viewport and its ResizeObserver is a no-op.
test.describe('VirtualList — real-browser geometry', () => {
  test('renders an overscanned window, not every row', async ({ mount }) => {
    const component = await mount(
      <VirtualListFixture count={1000} rowHeight={40} estimateSize={40} height={300} />,
    );
    const count = await component.locator('[data-index]').count();
    // viewport 300 / 40 ≈ 7-8 visible; default overscan 5 each side ⇒ ~18.
    expect(count).toBeGreaterThan(8); // overscan: strictly more than what fits
    expect(count).toBeLessThan(60); // windowed: nowhere near 1000
  });

  test('scrolling the container shifts the rendered window forward', async ({ mount }) => {
    const component = await mount(
      <VirtualListFixture count={1000} rowHeight={40} estimateSize={40} height={300} />,
    );
    const firstIndex = () =>
      component.locator('[data-index]').first().getAttribute('data-index');

    expect(Number(await firstIndex())).toBe(0);

    const applied = await component.evaluate((el) => {
      el.scrollTop = 4000; // row ~100 at 40px/row
      el.dispatchEvent(new Event('scroll')); // ensure the virtualizer's listener fires
      return el.scrollTop;
    });
    expect(applied).toBeGreaterThan(0); // element is genuinely scrollable

    // scroll handler re-windows asynchronously
    await expect.poll(async () => Number(await firstIndex())).toBeGreaterThan(50);
  });

  test('measureElement remeasures rows taller than the estimate', async ({ mount }) => {
    // estimate 20px but each row is actually 60px tall. After the real
    // ResizeObserver measures the rendered rows, the inner sizer height must
    // reflect measured size, not the naive count × estimate (5 × 20 = 100).
    const component = await mount(
      <VirtualListFixture count={5} rowHeight={60} estimateSize={20} height={400} />,
    );
    const sizer = component.locator('div').first();

    await expect
      .poll(async () => sizer.evaluate((el) => (el as HTMLElement).offsetHeight))
      .toBeGreaterThan(100); // grew past count × estimate ⇒ remeasure happened

    const measured = await sizer.evaluate((el) => (el as HTMLElement).offsetHeight);
    expect(measured).toBeGreaterThanOrEqual(5 * 60 * 0.9); // ≈ 5 × 60 = 300
  });
});
