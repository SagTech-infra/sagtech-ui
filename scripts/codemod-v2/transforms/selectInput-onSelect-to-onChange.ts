/**
 * codemod-v2: SelectInput.onSelect → SelectInput.onChange  (STUB)
 *
 * Intent (v2.0): `SelectInput`'s `onSelect` prop is `@deprecated` and will be
 * removed. Consumers should use the controlled `onChange` (value) instead.
 *
 * Why this is deferred / not yet implemented:
 *   - In v1.x both `onSelect` and `onChange` can coexist on the same element,
 *     and `onSelect` is only fired when `onSelect !== onChange`. A naive rename
 *     to `onChange` could create a DUPLICATE `onChange` attribute (invalid JSX)
 *     or silently drop a distinct handler.
 *   - Correct migration must detect whether `onChange` already exists, and
 *     either merge the two handlers or flag the call site for manual review.
 *     That logic is non-trivial and best implemented against the final v2.0
 *     API once it is frozen.
 *
 * This stub is a no-op (returns the source unchanged) so the scaffold runs
 * cleanly. Implement before v2.0 GA.
 */
import type { FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo): string {
  // TODO v2.0: detect existing onChange, merge-or-flag, then rename onSelect.
  return file.source;
}
