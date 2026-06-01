/**
 * codemod-v2: Attachment.onUpload → Attachment.onChange
 *
 * ⚠️ MANUAL REVIEW REQUIRED — NOT A PURE RENAME.
 *
 * This transform renames the `onUpload` JSX attribute to `onChange` on
 * `<Attachment>` elements only. BUT the callback signatures may differ between
 * v1.x and v2.0:
 *
 *   v1.x  onUpload?: (files: Array<File> | undefined) => void
 *   v2.0  onChange?: (value: ...) => void   // shape may differ (e.g. a value
 *                                            // object instead of a File array)
 *
 * Renaming the attribute does NOT adapt the handler body. After running this,
 * you MUST manually verify every migrated handler still receives the argument
 * shape it expects. This codemod only moves the prop name; it cannot reason
 * about the function passed to it.
 *
 * Run (required --parser=tsx for .ts transform + .tsx sources):
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/attachment-onUpload-to-onChange.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts
 *
 * Idempotent: re-running finds no remaining `onUpload` on `<Attachment>`.
 */
import type { API, FileInfo, JSXIdentifier } from 'jscodeshift';

const OLD_NAME = 'onUpload';
const NEW_NAME = 'onChange';
const TARGET_ELEMENT = 'Attachment';

export default function transformer(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);
  let renamed = 0;

  root
    .find(j.JSXOpeningElement, {
      name: { type: 'JSXIdentifier', name: TARGET_ELEMENT },
    })
    .forEach((openingPath) => {
      j(openingPath)
        .find(j.JSXAttribute, {
          name: { type: 'JSXIdentifier', name: OLD_NAME },
        })
        .forEach((attrPath) => {
          (attrPath.node.name as JSXIdentifier).name = NEW_NAME;
          renamed += 1;
        });
    });

  if (renamed > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[attachment-onUpload-to-onChange] ${file.path}: renamed ${renamed} ` +
        `onUpload→onChange. VERIFY handler signature — onUpload received ` +
        `(files: Array<File> | undefined); onChange may receive a different ` +
        `value shape in v2.0.`,
    );
  }

  return root.toSource();
}
