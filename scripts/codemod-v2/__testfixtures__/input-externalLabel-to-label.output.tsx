/*
 * codemod-v2: review <Input> label: in v2.0 <Input>'s `label` is the STATIC label; the old
 * floating label is now `floatingLabel`. Rename any floating usage by hand.
 * See docs/MIGRATION.md (v1.9 → v2.0).
 */
import { Input, PhoneInput } from '@sagtech-infra/ui';
import { SomeOtherField } from './SomeOtherField';

export function Example({ v, set }: { v: string; set: (s: string) => void }) {
  return (
    <form>
      {/* Pre-migration <Input>: externalLabel → label, floating label → floatingLabel */}
      <Input label="Email" floatingLabel="Email" value={v} onChange={set} />
      {/* <Input> with only externalLabel: externalLabel → label, no floating */}
      <Input label="Name" value={v} onChange={set} />
      {/* PhoneInput: externalLabel → label (no floating concept) */}
      <PhoneInput label="Phone" value={v} onChange={set} />
      {/* Scoping guard: externalLabel on a different component must NOT change */}
      <SomeOtherField externalLabel="Untouched" value={v} onChange={set} />
      {/* Ambiguous: <Input> with only `label` — flagged, never auto-renamed */}
      <Input label="Maybe floating?" value={v} onChange={set} />
    </form>
  );
}
