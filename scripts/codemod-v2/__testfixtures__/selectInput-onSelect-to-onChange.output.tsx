/*
 * codemod-v2: review <SelectInput>:
 *   - both `onSelect` and `onChange` are set — merge the handlers by hand (`onSelect` is removed in v2.0)
 *   - `register`/`name` (react-hook-form) are removed — rewire to a controlled `value` + `onChange`
 * See docs/MIGRATION.md (v1.9 → v2.0).
 */
import { SelectInput } from '@sagtech-infra/ui';

export function Example({ a, b, r }: { a: (v: string) => void; b: (v: string) => void; r: unknown }) {
  return (
    <>
      {/* onSelect only → renamed to onChange */}
      <SelectInput options={[]} value="" placeholder="x" onChange={a} />
      {/* onSelect + onChange → flagged, left untouched (merge by hand) */}
      <SelectInput options={[]} value="" placeholder="x" onChange={a} onSelect={b} />
      {/* register + name → flagged, left untouched (rewire to controlled) */}
      <SelectInput options={[]} value="" placeholder="x" register={r as never} name={'f' as never} onChange={a} />
    </>
  );
}
