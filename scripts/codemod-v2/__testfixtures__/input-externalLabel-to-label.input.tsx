import { Input } from '@sagtech-infra/ui';
import { SomeOtherField } from './SomeOtherField';

export function Example({ v, set }: { v: string; set: (s: string) => void }) {
  return (
    <form>
      {/* Target: externalLabel on <Input> must become label */}
      <Input externalLabel="Email" value={v} onChange={set} />

      {/* Scoping guard: externalLabel on a different component must NOT change */}
      <SomeOtherField externalLabel="Untouched" value={v} onChange={set} />
    </form>
  );
}
