import { test, expect } from '@playwright/experimental-ct-react';
import {
  RichTextImageFixture,
  RichTextMentionFixture,
  RichTextSlashFixture,
  RichTextSyntaxFixture,
} from './RichTextEditor.fixtures';

// Real-browser coverage for ProseMirror behaviour happy-dom cannot reach (see
// the NOTEs in imageUpload/mention/slashCommand/syntaxHighlight tests): the PM
// view's paste/drop handlers, suggestion popovers positioned via getBoundingClientRect,
// and lowlight decorations all require a real layout engine + event pipeline.

test.describe('RichTextEditor — syntax highlight', () => {
  test('renders hljs token spans for a code block', async ({ mount }) => {
    const c = await mount(<RichTextSyntaxFixture />);
    // CodeBlockLowlight puts HTMLAttributes (the class) on the <pre> wrapper.
    await expect(c.locator('pre.sagtech-code-block')).toBeVisible();
    await expect
      .poll(async () => c.locator('.sagtech-rte-content [class*="hljs-"]').count())
      .toBeGreaterThan(0);
  });
});

test.describe('RichTextEditor — image paste/drop', () => {
  test('pasting an image file inserts an <img> via the upload handler', async ({ mount }) => {
    const c = await mount(<RichTextImageFixture />);
    const editor = c.locator('.ProseMirror');
    await editor.click();

    await editor.evaluate((el) => {
      const dt = new DataTransfer();
      dt.items.add(new File([new Uint8Array([137, 80, 78, 71])], 'pasted.png', { type: 'image/png' }));
      el.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }),
      );
    });

    await expect.poll(async () => c.locator('.sagtech-rte-content img').count()).toBeGreaterThan(0);
  });

  test('dropping an image file inserts an <img>', async ({ mount }) => {
    const c = await mount(<RichTextImageFixture />);
    const editor = c.locator('.ProseMirror');

    await editor.evaluate((el) => {
      const dt = new DataTransfer();
      dt.items.add(new File([new Uint8Array([137, 80, 78, 71])], 'dropped.png', { type: 'image/png' }));
      const r = el.getBoundingClientRect();
      // ProseMirror's drop handler bails without a valid drop position, so the
      // event must carry coordinates inside the editable.
      el.dispatchEvent(
        new DragEvent('drop', {
          dataTransfer: dt,
          clientX: r.x + r.width / 2,
          clientY: r.y + r.height / 2,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    await expect.poll(async () => c.locator('.sagtech-rte-content img').count()).toBeGreaterThan(0);
  });
});

test.describe('RichTextEditor — suggestion popovers', () => {
  test('typing "@" opens the popover, ArrowDown moves selection, Enter inserts', async ({
    mount,
    page,
  }) => {
    const c = await mount(<RichTextMentionFixture />);
    await c.locator('.ProseMirror').click();
    await page.keyboard.type('@');

    const listbox = page.getByRole('listbox', { name: 'Suggestions' });
    await expect(listbox).toBeVisible();
    const options = listbox.getByRole('option');
    await expect(options).toHaveCount(3); // Alice, Bob, Charlie (empty query)

    // ArrowDown must move the highlight — guards the forceUpdate re-render fix.
    await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');

    // Enter commits the selected item via the TipTap suggestion command.
    await page.keyboard.press('Enter');
    await expect.poll(async () => c.locator('.sagtech-mention').count()).toBeGreaterThan(0);
  });

  test('typing "/" opens the command palette popover', async ({ mount, page }) => {
    const c = await mount(<RichTextSlashFixture />);
    await c.locator('.ProseMirror').click();
    await page.keyboard.type('/');

    const listbox = page.getByRole('listbox', { name: 'Suggestions' });
    await expect(listbox).toBeVisible();
    // defaultSlashCommands has 6 entries; empty query shows them all.
    await expect(listbox.getByRole('option')).toHaveCount(6);
  });
});
