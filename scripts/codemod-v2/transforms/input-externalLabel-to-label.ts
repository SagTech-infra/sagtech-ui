/**
 * codemod-v2: label unification for <Input> and <PhoneInput>
 *
 * v2.0 makes `label` the static, htmlFor-associated label on every field
 * (per docs/API_CONVENTIONS.md). Per component:
 *   <Input>       externalLabel → label   AND   label (floating) → floatingLabel
 *   <PhoneInput>  externalLabel → label
 *
 * The Input `label` prop is ambiguous across versions: in v1.x it was the
 * floating label (shown at state='active'); in v2.0 it is the static label.
 * To stay safe AND idempotent this transform only rewrites an <Input> when it
 * still carries `externalLabel` — the unambiguous "pre-migration" signal. For
 * such an element it renames the floating `label` → `floatingLabel` FIRST, then
 * `externalLabel` → `label` (order matters, else the new label is swept away).
 *
 * An <Input> that has only `label` (no externalLabel, no floatingLabel) is
 * genuinely ambiguous — it gets a one-time banner flag for manual review
 * instead of a risky rename. <PhoneInput> has no floating concept, so its
 * `externalLabel` → `label` is always safe.
 *
 * Scoped strictly to <Input> / <PhoneInput> opening tags. Run once:
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/input-externalLabel-to-label.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts [--dry --print]
 */
import type { API, FileInfo, JSXIdentifier, JSXOpeningElement } from 'jscodeshift';

const TARGETS = new Set(['Input', 'PhoneInput']);
const MARKER = 'codemod-v2: review <Input> label';

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
  let flag = false;

  const rename = (opening: ReturnType<typeof root.find>, from: string, to: string) =>
    opening
      .find(j.JSXAttribute, { name: { type: 'JSXIdentifier', name: from } })
      .forEach((attrPath) => {
        (attrPath.node.name as JSXIdentifier).name = to;
      });

  root
    .find(j.JSXOpeningElement)
    .filter(
      (p) => p.node.name.type === 'JSXIdentifier' && TARGETS.has(p.node.name.name),
    )
    .forEach((path) => {
      const elName = (path.node.name as JSXIdentifier).name;
      const names = attrNamesOf(path.node);
      const opening = j(path);

      if (names.has('externalLabel')) {
        // Unambiguous pre-migration element.
        if (elName === 'Input' && names.has('label')) {
          rename(opening, 'label', 'floatingLabel');
        }
        rename(opening, 'externalLabel', 'label');
        return;
      }

      // Ambiguous: an <Input> with only `label` (could be old floating or new
      // static). Flag for manual review; never auto-rewrite.
      if (elName === 'Input' && names.has('label') && !names.has('floatingLabel')) {
        flag = true;
      }
    });

  if (flag && !file.source.includes(MARKER)) {
    const body = root.find(j.Program).get('body', 0);
    if (body?.node) {
      const banner = j.commentBlock(
        `\n * ${MARKER}: in v2.0 <Input>'s \`label\` is the STATIC label; the old\n * floating label is now \`floatingLabel\`. Rename any floating usage by hand.\n * See docs/MIGRATION.md (v1.9 → v2.0).\n `,
        true,
        false,
      );
      body.node.comments = body.node.comments ?? [];
      body.node.comments.unshift(banner);
    }
  }

  return root.toSource();
}
