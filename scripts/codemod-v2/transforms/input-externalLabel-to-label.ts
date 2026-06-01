/**
 * codemod-v2: Input.externalLabel → Input.label
 *
 * v2.0 renames the `externalLabel` prop on `<Input>` to `label`.
 * This transform renames the JSX attribute on `<Input>` elements ONLY —
 * an `externalLabel` prop on any other component is left untouched.
 *
 * The signatures are identical (both `string | undefined`), so this is a
 * safe mechanical rename with no handler-shape concerns.
 *
 * Run (note the required --parser=tsx for .ts transform + .tsx sources):
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/input-externalLabel-to-label.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts
 *
 * Idempotent: re-running finds no remaining `externalLabel` on `<Input>`.
 */
import type { API, FileInfo, JSXIdentifier } from 'jscodeshift';

const OLD_NAME = 'externalLabel';
const NEW_NAME = 'label';
const TARGET_ELEMENT = 'Input';

export default function transformer(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Scope strictly to <Input ...> opening tags (ignores externalLabel
  // on any other component).
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
