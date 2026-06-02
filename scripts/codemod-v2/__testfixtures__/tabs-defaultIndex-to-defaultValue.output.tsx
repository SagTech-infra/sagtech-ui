/*
 * codemod-v2: review <Tabs defaultIndex>: a dynamic `defaultIndex` could not be converted to a
 * `defaultValue="tab-<n>"` automatically. Set defaultValue to the target
 * tab id by hand. See docs/MIGRATION.md (v1.9 → v2.0).
 */
import { Tabs } from '@sagtech-infra/ui';

const items = [
  { label: 'A', content: 'a' },
  { label: 'B', content: 'b' },
];

export function Example({ idx }: { idx: number }) {
  return (
    <>
      {/* numeric literal → defaultValue="tab-1" */}
      <Tabs defaultValue="tab-1" items={items} />
      {/* dynamic index → flagged, left untouched */}
      <Tabs defaultIndex={idx} items={items} />
    </>
  );
}
