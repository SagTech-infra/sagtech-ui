import { SelectInput } from '@sagtech-infra/ui';

export function Example({ a, b, r }: { a: (v: string) => void; b: (v: string) => void; r: unknown }) {
  return (
    <>
      {/* onSelect only → renamed to onChange */}
      <SelectInput options={[]} value="" placeholder="x" onSelect={a} />

      {/* onSelect + onChange → flagged, left untouched (merge by hand) */}
      <SelectInput options={[]} value="" placeholder="x" onChange={a} onSelect={b} />

      {/* register + name → flagged, left untouched (rewire to controlled) */}
      <SelectInput options={[]} value="" placeholder="x" register={r as never} name={'f' as never} onChange={a} />
    </>
  );
}
