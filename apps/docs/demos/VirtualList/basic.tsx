'use client';
import { VirtualList } from '@sagtech-infra/ui';

export default function Demo() {
  const items = Array.from({ length: 10_000 }, (_, i) => ({
    id: i,
    text: `Row ${i + 1} — generated item with some content`,
  }));
  return (
    <div className="w-full max-w-[420px]">
      <VirtualList
        items={items}
        getItemKey={(item) => item.id}
        height={480}
        estimateSize={48}
        className="bg-black_1 border border-solid border-black_3 rounded-8px"
        renderItem={(item) => (
          <div className="px-16px py-12px border-b border-solid border-black_3 text-14 text-fg-primary font-manrope">
            {item.text}
          </div>
        )}
      />
    </div>
  );
}
