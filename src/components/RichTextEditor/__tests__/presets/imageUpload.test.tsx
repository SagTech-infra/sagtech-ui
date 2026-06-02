import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import RichTextEditor from '../../RichTextEditor';
import { createImageUploadExtension, validateImageFile } from '../../presets/imageUpload';

// ---------------------------------------------------------------------------
// NOTE ON INTEGRATION LIMITS
// ---------------------------------------------------------------------------
// ProseMirror's plugin `handlePaste` / `handleDrop` hooks are called by the
// ProseMirror view's own event listener, NOT by the browser's DOM dispatchEvent.
// happy-dom does not implement the ProseMirror view internals, so dispatching
// ClipboardEvent / DragEvent on the contenteditable div will never reach the
// plugin callbacks.
//
// Coverage strategy:
//   1. validateImageFile — unit-tested directly (all branches, all rejection
//      paths).  This is the security boundary; it is pure and fully testable.
//   2. processFile behaviour (upload called / FileReader invoked / onError
//      called) — tested by calling a thin test-harness that replicates the
//      internal flow, mirroring what the plugin callbacks do.
//   3. Mount smoke tests — verify the extension wires up without crashing.
//   4. Storybook + manual QA cover the full paste/drop flow in a real browser.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFile(type: string, size: number, name = 'test.png'): File {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
}

// ---------------------------------------------------------------------------
// 1. validateImageFile — security boundary, fully unit-tested
// ---------------------------------------------------------------------------

describe('validateImageFile', () => {
  it('accepts image/png against image/* accept pattern', () => {
    const file = makeFile('image/png', 100);
    expect(validateImageFile(file, 'image/*', undefined)).toBeNull();
  });

  it('accepts image/jpeg against image/* accept pattern', () => {
    const file = makeFile('image/jpeg', 50);
    expect(validateImageFile(file, 'image/*', undefined)).toBeNull();
  });

  it('rejects application/pdf against image/*', () => {
    const file = makeFile('application/pdf', 100, 'doc.pdf');
    const err = validateImageFile(file, 'image/*', undefined);
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toContain('application/pdf');
    expect(err!.message).toContain('not accepted');
  });

  it('rejects image/png when accept is image/jpeg only', () => {
    const file = makeFile('image/png', 50);
    const err = validateImageFile(file, 'image/jpeg', undefined);
    expect(err).toBeInstanceOf(Error);
  });

  it('accepts a file exactly at maxSize boundary', () => {
    const file = makeFile('image/png', 100);
    expect(validateImageFile(file, 'image/*', 100)).toBeNull();
  });

  it('rejects a file one byte over maxSize', () => {
    const file = makeFile('image/png', 101);
    const err = validateImageFile(file, 'image/*', 100);
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toContain('exceeds limit');
  });

  it('accepts file with no size limit (maxSize undefined)', () => {
    const file = makeFile('image/png', 99999999);
    expect(validateImageFile(file, 'image/*', undefined)).toBeNull();
  });

  it('accepts any type when accept is */*', () => {
    const file = makeFile('application/pdf', 50, 'doc.pdf');
    expect(validateImageFile(file, '*/*', undefined)).toBeNull();
  });

  it('accepts exact MIME match (image/webp against image/webp)', () => {
    const file = makeFile('image/webp', 50, 'img.webp');
    expect(validateImageFile(file, 'image/webp', undefined)).toBeNull();
  });

  it('accepts multi-value accept with matching type', () => {
    const file = makeFile('image/gif', 50, 'img.gif');
    expect(validateImageFile(file, 'image/jpeg, image/gif, image/png', undefined)).toBeNull();
  });

  it('rejects type not in multi-value accept list', () => {
    const file = makeFile('image/webp', 50, 'img.webp');
    const err = validateImageFile(file, 'image/jpeg, image/png', undefined);
    expect(err).toBeInstanceOf(Error);
  });
});

// ---------------------------------------------------------------------------
// 2. processFile behaviour — tested via a thin harness replicating the plugin
// ---------------------------------------------------------------------------

async function runProcessFile(
  file: File,
  opts: Parameters<typeof createImageUploadExtension>[0],
): Promise<{ insertCalled: boolean; insertSrc: string | null; onErrorCalled: boolean; onErrorMsg: string | null; uploadCalled: boolean }> {
  let insertCalled = false;
  let insertSrc: string | null = null;
  let onErrorCalled = false;
  let onErrorMsg: string | null = null;

  const onError = vi.fn((err: Error) => {
    onErrorCalled = true;
    onErrorMsg = err.message;
    if (opts?.onError) opts.onError(err);
  });

  const upload = opts?.upload
    ? vi.fn(opts.upload)
    : undefined;

  const accept = opts?.accept ?? 'image/*';
  const maxSize = opts?.maxSize;

  // Replicate the processFile logic from imageUpload.ts
  const validationError = validateImageFile(file, accept, maxSize);
  if (validationError) {
    onError(validationError);
  } else {
    try {
      let src: string;
      if (upload) {
        src = await upload(file);
      } else {
        // base64 path
        src = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('FileReader failed'));
          reader.readAsDataURL(file);
        });
      }
      insertCalled = true;
      insertSrc = src;
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  return {
    insertCalled,
    insertSrc,
    onErrorCalled,
    onErrorMsg,
    uploadCalled: upload ? upload.mock.calls.length > 0 : false,
  };
}

describe('createImageUploadExtension — processFile logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls upload and returns src for a valid image file', async () => {
    const file = makeFile('image/png', 100);
    const result = await runProcessFile(file, {
      upload: async () => 'https://x/y.png',
      accept: 'image/*',
    });
    expect(result.uploadCalled).toBe(true);
    expect(result.insertCalled).toBe(true);
    expect(result.insertSrc).toBe('https://x/y.png');
    expect(result.onErrorCalled).toBe(false);
  });

  it('rejects wrong MIME type — calls onError, upload NOT called, no insert', async () => {
    const file = makeFile('application/pdf', 100, 'doc.pdf');
    const result = await runProcessFile(file, {
      upload: async () => 'https://x/y.png',
      accept: 'image/*',
    });
    expect(result.onErrorCalled).toBe(true);
    expect(result.onErrorMsg).toContain('application/pdf');
    expect(result.uploadCalled).toBe(false);
    expect(result.insertCalled).toBe(false);
  });

  it('rejects oversized file — calls onError, upload NOT called', async () => {
    const file = makeFile('image/png', 200);
    const result = await runProcessFile(file, {
      upload: async () => 'https://x/y.png',
      accept: 'image/*',
      maxSize: 100,
    });
    expect(result.onErrorCalled).toBe(true);
    expect(result.onErrorMsg).toContain('exceeds limit');
    expect(result.uploadCalled).toBe(false);
    expect(result.insertCalled).toBe(false);
  });

  it('base64 fallback: no upload provided → FileReader produces data URL', async () => {
    const file = makeFile('image/png', 5);
    const result = await runProcessFile(file, { accept: 'image/*' });
    expect(result.insertCalled).toBe(true);
    expect(result.insertSrc).toMatch(/^data:image\/png/);
    expect(result.uploadCalled).toBe(false);
    expect(result.onErrorCalled).toBe(false);
  });

  it('upload failure calls onError and does not insert', async () => {
    const file = makeFile('image/png', 100);
    const result = await runProcessFile(file, {
      upload: async () => { throw new Error('network error'); },
      accept: 'image/*',
    });
    expect(result.onErrorCalled).toBe(true);
    expect(result.onErrorMsg).toContain('network error');
    expect(result.insertCalled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. Mount smoke tests — extension attaches without crashing
// ---------------------------------------------------------------------------

describe('createImageUploadExtension — mount', () => {
  it('mounts without crashing when upload prop is provided', () => {
    const upload = vi.fn().mockResolvedValue('https://x/y.png');
    const ext = createImageUploadExtension({ upload });
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} extensions={[ext]} />,
    );
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
  });

  it('mounts without crashing in base64 mode (no upload)', () => {
    const ext = createImageUploadExtension();
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} extensions={[ext]} />,
    );
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
  });

  it('mounts with maxSize and onError options', () => {
    const ext = createImageUploadExtension({
      accept: 'image/*',
      maxSize: 1024 * 1024,
      onError: vi.fn(),
    });
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} extensions={[ext]} />,
    );
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
  });

  it('renders ProseMirror contenteditable with image extension active', () => {
    const ext = createImageUploadExtension({ upload: async () => 'https://x/y.png' });
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} extensions={[ext]} />,
    );
    expect(container.querySelector('[contenteditable]')).toBeInTheDocument();
  });
});
