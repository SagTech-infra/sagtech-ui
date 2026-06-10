'use client';
import { useState } from 'react';
import { SortableList } from '@sagtech-infra/ui';

interface Task {
  id: string;
  title: string;
}

export default function Demo() {
  const [items, setItems] = useState<Task[]>([
    { id: '1', title: 'Design review' },
    { id: '2', title: 'Stand-up' },
    { id: '3', title: 'Code-freeze prep' },
    { id: '4', title: 'QA handover' },
  ]);

  return (
    <div className="w-full max-w-[420px]">
      <SortableList
        items={items}
        getItemId={(i) => i.id}
        onReorder={setItems}
        className="flex flex-col gap-8px"
        renderItem={(item, { isDragging, dragHandleProps }) => (
          <div
            className={`flex items-center gap-12px bg-black_2 border border-solid border-black_3 rounded-8px px-12px py-10px font-manrope text-14 text-fg-primary ${
              isDragging ? 'shadow-3xl' : ''
            }`}
          >
            <button
              type="button"
              {...(dragHandleProps as Record<string, unknown>)}
              className="text-fg-muted hover:text-fg-primary cursor-grab active:cursor-grabbing"
              aria-label={`Drag ${item.title}`}
            >
              ⠿
            </button>
            <span className="flex-1">{item.title}</span>
          </div>
        )}
      />
    </div>
  );
}
