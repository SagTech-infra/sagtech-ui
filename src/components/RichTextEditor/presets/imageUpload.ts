import Image from '@tiptap/extension-image';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { CreateImageUploadOptions } from './types';

// ---------------------------------------------------------------------------
// Validation helper (exported for unit-testing)
// ---------------------------------------------------------------------------

/**
 * validateImageFile — validate a File against accept pattern and maxSize.
 * Returns an Error if invalid, null if valid.
 */
export function validateImageFile(
  file: File,
  accept: string,
  maxSize: number | undefined,
): Error | null {
  const accepted = accept
    .split(',')
    .map((a) => a.trim())
    .some((a) => {
      if (a === '*/*') return true;
      if (a.endsWith('/*')) {
        const prefix = a.slice(0, a.length - 2);
        return file.type.startsWith(prefix);
      }
      return file.type === a;
    });

  if (!accepted) {
    return new Error(`File type "${file.type}" is not accepted (accept: "${accept}")`);
  }

  if (maxSize !== undefined && file.size > maxSize) {
    return new Error(
      `File size ${file.size} bytes exceeds limit of ${maxSize} bytes`,
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// base64 fallback
// ---------------------------------------------------------------------------

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------------
// Extract image files from DataTransferItemList or FileList
// ---------------------------------------------------------------------------

function extractImageFiles(items: DataTransferItemList | FileList): File[] {
  const files: File[] = [];
  if (items instanceof FileList) {
    for (let i = 0; i < items.length; i++) {
      const f = items[i];
      if (f && f.type.startsWith('image/')) files.push(f);
    }
  } else {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item && item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createImageUploadExtension — extends @tiptap/extension-image with
 * paste and drop handling that validates, uploads (or base64-encodes), and
 * inserts an image node into the editor.
 *
 * @example
 * const ext = createImageUploadExtension({
 *   upload: async (file) => {
 *     const fd = new FormData();
 *     fd.append('file', file);
 *     const res = await fetch('/api/upload', { method: 'POST', body: fd });
 *     return (await res.json()).url;
 *   },
 * });
 * <RichTextEditor extensions={[ext]} ... />
 */
export function createImageUploadExtension(opts: CreateImageUploadOptions = {}) {
  const { upload, accept = 'image/*', maxSize, onError } = opts;

  const handleError = (err: Error) => {
    if (onError) {
      onError(err);
    } else {
      console.error('[createImageUploadExtension]', err.message);
    }
  };

  const processFile = async (
    file: File,
    insertFn: (src: string) => void,
  ): Promise<void> => {
    const validationError = validateImageFile(file, accept, maxSize);
    if (validationError) {
      handleError(validationError);
      return;
    }
    try {
      const src = upload ? await upload(file) : await readAsDataURL(file);
      insertFn(src);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return Image.extend({
    addOptions() {
      return {
        ...this.parent?.(),
        // Allow base64 data-URLs only when no uploader is provided.
        allowBase64: !upload,
        inline: false as const,
        HTMLAttributes: {},
        resize: false as const,
      };
    },

    addProseMirrorPlugins() {
      const editor = this.editor;

      const parentPlugins = this.parent?.() ?? [];

      const imageUploadPlugin = new Plugin({
        key: new PluginKey('sagtech-imageUpload'),
        props: {
          handlePaste(_view: EditorView, event: ClipboardEvent): boolean {
            const items = event.clipboardData?.items;
            if (!items) return false;

            const imageFiles = extractImageFiles(items);
            if (imageFiles.length === 0) return false;

            event.preventDefault();

            for (const file of imageFiles) {
              void processFile(file, (src) => {
                editor.chain().focus().setImage({ src }).run();
              });
            }
            return true;
          },

          handleDrop(_view: EditorView, event: DragEvent): boolean {
            const files = event.dataTransfer?.files;
            if (!files || files.length === 0) return false;

            const imageFiles = extractImageFiles(files);
            if (imageFiles.length === 0) return false;

            event.preventDefault();

            for (const file of imageFiles) {
              void processFile(file, (src) => {
                editor.chain().focus().setImage({ src }).run();
              });
            }
            return true;
          },
        },
      });

      return [...parentPlugins, imageUploadPlugin];
    },
  });
}
