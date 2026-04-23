import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SortableList from './SortableList';

const meta = {
  title: 'Data Display/SortableList',
  component: SortableList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SortableList>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Task {
  id: string;
  title: string;
}

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="5" cy="4" r="1" fill="currentColor" />
      <circle cx="5" cy="8" r="1" fill="currentColor" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="11" cy="4" r="1" fill="currentColor" />
      <circle cx="11" cy="8" r="1" fill="currentColor" />
      <circle cx="11" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export const Vertical: Story = {
  render: function VerticalStory() {
    const [items, setItems] = useState<Task[]>([
      { id: '1', title: 'Design review' },
      { id: '2', title: 'Stand-up' },
      { id: '3', title: 'Code-freeze prep' },
      { id: '4', title: 'QA handover' },
    ]);

    return (
      <SortableList
        items={items}
        getItemId={(i) => i.id}
        onReorder={setItems}
        className="flex flex-col gap-8px"
        renderItem={(item, { isDragging, dragHandleProps }) => (
          <div
            className={`flex items-center gap-12px bg-black_2 border border-solid border-black_3 rounded-8px px-12px py-10px font-manrope text-14 text-white_4 ${
              isDragging ? 'shadow-3xl' : ''
            }`}
          >
            <button
              type="button"
              {...(dragHandleProps as Record<string, unknown>)}
              className="text-grey_4 hover:text-white_4 cursor-grab active:cursor-grabbing"
              aria-label={`Drag ${item.title}`}
            >
              <DragHandleIcon />
            </button>
            <span className="flex-1">{item.title}</span>
          </div>
        )}
      />
    );
  },
};

export const Horizontal: Story = {
  render: function HorizontalStory() {
    const [items, setItems] = useState(['🟣', '🟢', '🟡', '🔴']);
    return (
      <SortableList
        items={items}
        getItemId={(i) => i}
        onReorder={setItems}
        direction="horizontal"
        renderItem={(item, { dragHandleProps }) => (
          <button
            type="button"
            {...(dragHandleProps as Record<string, unknown>)}
            className="w-[48px] h-[48px] rounded-8px bg-black_2 border border-solid border-black_3 text-24 cursor-grab active:cursor-grabbing"
          >
            {item}
          </button>
        )}
      />
    );
  },
};
