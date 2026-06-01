/**
 * codemod-v2: remove the Notification family
 *
 * v2.0 removes the deprecated `Notification` family in favour of `Toast`
 * (`Toaster` + imperative `toast.success()` / `toast.error()` /
 * `toast.promise()`). Removed members:
 *   - Notification
 *   - NotificationContext
 *   - NotificationContextProvider
 *   - NotificationWrapper
 *
 * `NotificationCenter` (and its `NotificationCenterProps` / `NotificationItem`
 * / `NotificationVariant` types) is a SEPARATE, non-deprecated component and is
 * matched by exact specifier name, so it is never touched.
 *
 * Best-effort behavior (see scripts/codemod-v2/README.md for limits):
 *   - Strips the four removed members from any import declaration, preserving
 *     other named imports; drops an import line that becomes empty.
 *   - FLAGS remaining usages (JSX elements, hook/context references) with a
 *     banner comment at the top of the file. provider+context → imperative
 *     toast() is a structural migration, not a 1:1 swap, so it is NOT rewritten
 *     automatically.
 *
 * Run (note the required --parser=tsx for a .ts transform + .tsx sources):
 *   pnpm dlx jscodeshift \
 *     -t scripts/codemod-v2/transforms/remove-notification-family.ts \
 *     "src/**\/*.tsx" --parser=tsx --extensions=tsx,ts
 *
 * Idempotent: the banner is added at most once; imports are only stripped once.
 */
import type { API, FileInfo } from 'jscodeshift';

const REMOVED = new Set([
  'Notification',
  'NotificationContext',
  'NotificationContextProvider',
  'NotificationWrapper',
]);

const MARKER = 'codemod-v2: Notification family removed';

export default function transformer(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 1. Strip removed members from import declarations (exact specifier name).
  root.find(j.ImportDeclaration).forEach((path) => {
    const specifiers = path.node.specifiers ?? [];
    const kept = specifiers.filter(
      (spec) =>
        spec.type !== 'ImportSpecifier' || !REMOVED.has(spec.imported.name),
    );
    if (kept.length === specifiers.length) return;
    if (kept.length === 0) {
      j(path).remove();
    } else {
      path.node.specifiers = kept;
    }
  });

  // 2. Detect remaining references (JSX or identifiers) to flag for the dev.
  const remaining = new Set<string>();
  root
    .find(j.JSXIdentifier)
    .filter((p) => REMOVED.has(p.node.name))
    .forEach((p) => remaining.add(p.node.name));
  root
    .find(j.Identifier)
    .filter((p) => REMOVED.has(p.node.name))
    .forEach((p) => remaining.add(p.node.name));

  // 3. Flag once with a top-of-file banner (skip if already flagged).
  if (remaining.size > 0 && !file.source.includes(MARKER)) {
    const body = root.find(j.Program).get('body', 0);
    if (body?.node) {
      const names = [...remaining].sort().join(', ');
      const banner = j.commentBlock(
        `\n * ${MARKER}.\n * Manual migration needed — replace ${names} with Toast:\n *   mount <Toaster /> once at the app root, then call toast.success(msg) /\n *   toast.error(msg) instead of the Notification provider + context.\n * See docs/MIGRATION.md (v1.9 → v2.0).\n `,
        true,
        false,
      );
      body.node.comments = body.node.comments ?? [];
      body.node.comments.unshift(banner);
    }
  }

  return root.toSource();
}
