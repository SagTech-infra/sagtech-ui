/**
 * codemod-v2: Tabs.defaultIndex → Tabs.defaultValue
 *
 * v2.0 removes the deprecated numeric `defaultIndex` from the items-facade
 * `<Tabs>`. The facade keeps the internal `tab-<index>` id scheme, so
 * `defaultValue` is the string id of the default tab.
 *
 * Best-effort behavior (see scripts/codemod-v2/README.md for limits):
 *   - `defaultIndex={N}` with a NUMERIC LITERAL → `defaultValue="tab-N"` (safe).
 *   - `defaultIndex={expr}` where expr is dynamic (variable / computed) →
 *     NOT rewritten; flagged, because the codemod can't statically resolve the
 *     index to a `tab-<n>` id.
 * Only the `<Tabs>` facade is touched; `<Tabs.Root>` already uses `defaultValue`.
 *
 * Run once:
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/tabs-defaultIndex-to-defaultValue.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts [--dry --print]
 */
import type { API, FileInfo, JSXIdentifier } from 'jscodeshift';

const TARGET = 'Tabs';
const OLD = 'defaultIndex';
const NEW = 'defaultValue';
const MARKER = 'codemod-v2: review <Tabs defaultIndex>';

export default function transformer(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);
  let flag = false;

  root
    .find(j.JSXOpeningElement, { name: { type: 'JSXIdentifier', name: TARGET } })
    .forEach((path) => {
      j(path)
        .find(j.JSXAttribute, { name: { type: 'JSXIdentifier', name: OLD } })
        .forEach((attrPath) => {
          const value = attrPath.node.value;
          const expr =
            value && value.type === 'JSXExpressionContainer' ? value.expression : null;

          // Numeric literal (babel: NumericLiteral; estree: Literal w/ number).
          const num =
            expr && expr.type === 'NumericLiteral'
              ? expr.value
              : expr && expr.type === 'Literal' && typeof expr.value === 'number'
                ? expr.value
                : null;

          if (num !== null) {
            (attrPath.node.name as JSXIdentifier).name = NEW;
            attrPath.node.value = j.stringLiteral(`tab-${num}`);
          } else {
            flag = true;
          }
        });
    });

  if (flag && !file.source.includes(MARKER)) {
    const body = root.find(j.Program).get('body', 0);
    if (body?.node) {
      const banner = j.commentBlock(
        `\n * ${MARKER}: a dynamic \`defaultIndex\` could not be converted to a\n * \`defaultValue="tab-<n>"\` automatically. Set defaultValue to the target\n * tab id by hand. See docs/MIGRATION.md (v1.9 → v2.0).\n `,
        true,
        false,
      );
      body.node.comments = body.node.comments ?? [];
      body.node.comments.unshift(banner);
    }
  }

  return root.toSource();
}
