import type { Meta, StoryObj } from '@storybook/react';
import VirtualList from './VirtualList';

const meta = {
  title: 'Data Display/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const items = Array.from({ length: 10_000 }, (_, i) => ({
      id: i,
      text: `Row ${i + 1} — generated item with some content`,
    }));
    return (
      <VirtualList
        items={items}
        getItemKey={(item) => item.id}
        height={480}
        estimateSize={48}
        className="bg-black_1 border border-solid border-black_3 rounded-8px"
        renderItem={(item) => (
          <div className="px-16px py-12px border-b border-solid border-black_3 text-14 text-white_4 font-manrope">
            {item.text}
          </div>
        )}
      />
    );
  },
};
