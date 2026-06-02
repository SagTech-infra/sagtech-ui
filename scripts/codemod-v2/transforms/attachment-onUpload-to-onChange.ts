/**
 * codemod-v2: Attachment.onUpload → Attachment.onChange
 *
 * v2.0 renames the `onUpload` prop on `<Attachment>` to `onChange` to match the
 * callback convention in docs/API_CONVENTIONS.md. The signature is IDENTICAL —
 *
 *   v1.x  onUpload?: (files: Array<File> | undefined) => void
 *   v2.0  onChange?: (files: Array<File> | undefined) => void
 *
 * — so this is a safe, pure mechanical rename of the JSX attribute, scoped to
 * `<Attachment>` only. An `onUpload` prop on any other component is untouched.
 *
 * Run (required --parser=tsx for a .ts transform + .tsx sources):
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/attachment-onUpload-to-onChange.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts [--dry --print]
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
        });
    });

  return root.toSource();
}
