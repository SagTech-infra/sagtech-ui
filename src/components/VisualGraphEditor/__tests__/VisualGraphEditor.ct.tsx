import { test, expect } from '@playwright/experimental-ct-react';
import { VisualGraphEditorFixture } from './VisualGraphEditor.fixtures';

// Real-browser coverage for behaviour happy-dom cannot reach (see the NOTE in
// VisualGraphEditor.test.tsx): @xyflow/react renders a zero-size viewport with
// no layout engine, so node drag, fitView and the MiniMap viewport never run.
test.describe('VisualGraphEditor — real-browser pointer/geometry', () => {
  test('mounts every node and fitView applies a non-identity viewport transform', async ({
    mount,
  }) => {
    const c = await mount(<VisualGraphEditorFixture />);
    await expect(c.locator('.react-flow__node')).toHaveCount(3);

    // fitView centres + scales the graph once the viewport has real dimensions.
    await expect
      .poll(async () =>
        c
          .locator('.react-flow__viewport')
          .first()
          .evaluate((el) => (el as HTMLElement).style.transform),
      )
      .toMatch(/scale\(/);
  });

  test('renders the MiniMap with a viewport mask', async ({ mount }) => {
    const c = await mount(<VisualGraphEditorFixture />);
    await expect(c.locator('.react-flow__minimap')).toBeVisible();
    await expect(c.locator('.react-flow__minimap-mask')).toHaveCount(1);
  });

  test('pointer-dragging a node updates its position via onNodesChange', async ({
    mount,
    page,
  }) => {
    const c = await mount(<VisualGraphEditorFixture />);
    const posBefore = await c.getByTestId('n1-pos').textContent();

    const node = c.locator('.react-flow__node[data-id="1"]');
    const box = await node.boundingBox();
    if (!box) throw new Error('node "1" has no bounding box');

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 + 70, {
      steps: 10,
    });
    await page.mouse.up();

    await expect.poll(async () => c.getByTestId('n1-pos').textContent()).not.toBe(posBefore);
  });

  test('readOnly suppresses node dragging', async ({ mount, page }) => {
    const c = await mount(<VisualGraphEditorFixture readOnly />);
    const posBefore = await c.getByTestId('n1-pos').textContent();

    const node = c.locator('.react-flow__node[data-id="1"]');
    const box = await node.boundingBox();
    if (!box) throw new Error('node "1" has no bounding box');

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 + 70, {
      steps: 10,
    });
    await page.mouse.up();

    // Allow any (incorrect) state update to flush, then assert it stayed put.
    await page.waitForTimeout(200);
    expect(await c.getByTestId('n1-pos').textContent()).toBe(posBefore);
  });
});
