/**
 * codemod-v2: remove the Notification family  (STUB)
 *
 * Intent (v2.0): the deprecated `Notification` family is removed in favour of
 * `Toast` (`Toaster` + imperative `toast.success()` / `toast.error()` /
 * `toast.promise()`). The members being removed:
 *   - Notification
 *   - NotificationContext
 *   - NotificationContextProvider
 *   - NotificationWrapper
 * (Note: `NotificationCenter` is a SEPARATE, non-deprecated component and must
 * NOT be touched by this transform.)
 *
 * Planned behavior:
 *   - Strip imports of the four removed members from `@sagtech-infra/ui`
 *     (and any re-export barrels), preserving other named imports on the line.
 *   - FLAG remaining usages (JSX elements, hook calls, provider wrappers) with
 *     an inserted comment so the developer migrates them to `Toast` by hand —
 *     the replacement is not a 1:1 mechanical swap (context/provider →
 *     imperative toast() differs structurally).
 *
 * Why this is deferred:
 *   - Removing a provider and rewriting consumers to the imperative `toast` API
 *     is a structural migration, not a rename. Auto-rewriting risks producing
 *     broken trees; flagging is safer until the v2.0 API is frozen.
 *
 * This stub is a no-op. Implement before v2.0 GA.
 */
import type { FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo): string {
  // TODO v2.0: strip Notification-family imports; flag remaining usages.
  //            Do NOT touch NotificationCenter.
  return file.source;
}
