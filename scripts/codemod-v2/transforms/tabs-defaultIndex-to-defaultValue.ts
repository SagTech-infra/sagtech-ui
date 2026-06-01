/**
 * codemod-v2: Tabs.defaultIndex → Tabs.defaultValue  (STUB)
 *
 * Intent (v2.0): the `items`-facade `<Tabs defaultIndex={n} />` prop is
 * `@deprecated`; the compound API (`Tabs.Root`) uses `defaultValue` keyed by a
 * tab id/value rather than a numeric index.
 *
 * Why this is deferred / likely semi-manual:
 *   - `defaultIndex` is a NUMBER (position in the `items` array); `defaultValue`
 *     is the VALUE/ID of a tab. Mapping index → value requires statically
 *     knowing the `items` array passed to that `<Tabs>` — which is frequently a
 *     variable, an imported constant, or computed at runtime. A codemod cannot
 *     reliably resolve `items[n].value` in the general case.
 *   - Internally v1.x maps `defaultIndex` to `` `tab-${defaultIndex}` `` for the
 *     compound API; whether v2.0 keeps that scheme or uses real item ids affects
 *     the correct rewrite.
 *
 * This stub is a no-op. A realistic v2.0 implementation will likely rename the
 * easy literal cases and FLAG the rest for manual migration.
 */
import type { FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo): string {
  // TODO v2.0: resolve items[index].value where statically known; flag the rest.
  return file.source;
}
