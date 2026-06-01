/**
 * codemod-v2: SelectInput → controlled-only
 *
 * v2.0 removes the deprecated `onSelect`, `register` and `name` props from
 * <SelectInput>; the component is controlled-only (`value` + `onChange`).
 *
 * Best-effort behavior (see scripts/codemod-v2/README.md for limits):
 *   - `onSelect` with NO sibling `onChange` → renamed to `onChange` (safe).
 *   - `onSelect` AND `onChange` both present → NOT renamed (would duplicate the
 *     attribute); flagged so the two handlers are merged by hand.
 *   - `register` / `name` (react-hook-form wiring) → NOT removed automatically;
 *     flagged, because dropping them requires rewiring the form to a controlled
 *     `value` + `onChange`, which is a structural change this transform can't do.
 *
 * Scoped strictly to <SelectInput>. Run once:
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/selectInput-onSelect-to-onChange.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts [--dry --print]
 */
import type { API, FileInfo, JSXIdentifier, JSXOpeningElement } from 'jscodeshift';

const TARGET = 'SelectInput';
const MARKER = 'codemod-v2: review <SelectInput>';

function attrNamesOf(node: JSXOpeningElement): Set<string> {
  const names = new Set<string>();
  for (const attr of node.attributes ?? []) {
    if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
      names.add(attr.name.name);
    }
  }
  return names;
}

export default function transformer(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);
  const reasons = new Set<string>();

  root
    .find(j.JSXOpeningElement, { name: { type: 'JSXIdentifier', name: TARGET } })
    .forEach((path) => {
      const names = attrNamesOf(path.node);

      if (names.has('onSelect')) {
        if (names.has('onChange')) {
          reasons.add(
            'both `onSelect` and `onChange` are set — merge the handlers by hand (`onSelect` is removed in v2.0)',
          );
        } else {
          j(path)
            .find(j.JSXAttribute, { name: { type: 'JSXIdentifier', name: 'onSelect' } })
            .forEach((attrPath) => {
              (attrPath.node.name as JSXIdentifier).name = 'onChange';
            });
        }
      }

      if (names.has('register') || names.has('name')) {
        reasons.add(
          '`register`/`name` (react-hook-form) are removed — rewire to a controlled `value` + `onChange`',
        );
      }
    });

  if (reasons.size > 0 && !file.source.includes(MARKER)) {
    const body = root.find(j.Program).get('body', 0);
    if (body?.node) {
      const lines = [...reasons].map((r) => ` *   - ${r}`).join('\n');
      const banner = j.commentBlock(
        `\n * ${MARKER}:\n${lines}\n * See docs/MIGRATION.md (v1.9 → v2.0).\n `,
        true,
        false,
      );
      body.node.comments = body.node.comments ?? [];
      body.node.comments.unshift(banner);
    }
  }

  return root.toSource();
}
