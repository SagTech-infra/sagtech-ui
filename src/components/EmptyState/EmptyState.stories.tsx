import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './EmptyState';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No data found',
    description: 'Try adjusting your filters or search terms to find what you are looking for.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No items yet',
    description: 'Get started by creating your first item.',
    action: <Button text="Add Item" variant="primary" buttonSize="small" />,
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: 'No search results',
    description: 'We could not find any results matching your query.',
    icon: (
      <svg
        width={48}
        height={48}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx={22} cy={22} r={14} stroke="#6A6A73" strokeWidth={2} />
        <path
          d="M32 32L42 42"
          stroke="#6A6A73"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M17 22H27M22 17V27"
          stroke="#6A6A73"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};
