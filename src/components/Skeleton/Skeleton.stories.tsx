import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './Skeleton';

const meta = {
  title: 'Foundations/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    rounded: {
      control: 'select',
      options: ['rect', 'circle', 'pill'],
    },
    count: { control: 'number' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextLines: Story = {
  args: {
    count: 3,
    width: 320,
    height: 14,
  },
};

export const Card: Story = {
  args: {
    width: 280,
    height: 160,
    rounded: 'rect',
  },
};

export const Avatar: Story = {
  args: {
    width: 48,
    height: 48,
    rounded: 'circle',
  },
};

export const Custom: Story = {
  render: () => (
    <div className="flex flex-col gap-16px p-24px bg-black_1 rounded-16px" style={{ width: 320 }}>
      <div className="flex items-center gap-12px">
        <Skeleton width={40} height={40} rounded="circle" />
        <div className="flex flex-col gap-4px flex-1">
          <Skeleton width={120} height={12} rounded="pill" />
          <Skeleton width={80} height={10} rounded="pill" />
        </div>
      </div>
      <Skeleton height={12} count={3} />
    </div>
  ),
};
