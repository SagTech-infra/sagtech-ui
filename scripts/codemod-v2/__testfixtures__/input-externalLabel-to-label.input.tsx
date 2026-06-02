import { Input, PhoneInput } from '@sagtech-infra/ui';
import { SomeOtherField } from './SomeOtherField';

export function Example({ v, set }: { v: string; set: (s: string) => void }) {
  return (
    <form>
      {/* Pre-migration <Input>: externalLabel → label, floating label → floatingLabel */}
      <Input externalLabel="Email" label="Email" value={v} onChange={set} />

      {/* <Input> with only externalLabel: externalLabel → label, no floating */}
      <Input externalLabel="Name" value={v} onChange={set} />

      {/* PhoneInput: externalLabel → label (no floating concept) */}
      <PhoneInput externalLabel="Phone" value={v} onChange={set} />

      {/* Scoping guard: externalLabel on a different component must NOT change */}
      <SomeOtherField externalLabel="Untouched" value={v} onChange={set} />

      {/* Ambiguous: <Input> with only `label` — flagged, never auto-renamed */}
      <Input label="Maybe floating?" value={v} onChange={set} />
    </form>
  );
}
