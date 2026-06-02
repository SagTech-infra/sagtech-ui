import { Tabs } from '@sagtech-infra/ui';

const items = [
  { label: 'A', content: 'a' },
  { label: 'B', content: 'b' },
];

export function Example({ idx }: { idx: number }) {
  return (
    <>
      {/* numeric literal → defaultValue="tab-1" */}
      <Tabs defaultIndex={1} items={items} />

      {/* dynamic index → flagged, left untouched */}
      <Tabs defaultIndex={idx} items={items} />
    </>
  );
}
