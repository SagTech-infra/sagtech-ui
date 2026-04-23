import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta = {
  title: 'Data Display/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="bg-black_1 p-24px rounded-16px max-w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,520',
  },
};

export const WithChangeUp: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,520',
    change: { value: 12.5, direction: 'up' },
  },
};

export const WithChangeDown: Story = {
  args: {
    label: 'Churn Rate',
    value: '4.8%',
    change: { value: 3.2, direction: 'down' },
  },
};

function DollarIcon() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 4V36M28 12C28 7.58 24.42 8 20 8C15.58 8 12 9.58 12 14C12 18.42 20 18 20 22C20 26 28 25.58 28 22C28 18.42 20 18 20 14"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const WithIcon: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,520',
    change: { value: 12.5, direction: 'up' },
    icon: <DollarIcon />,
  },
};

function UsersIcon() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 35V32C28 29.79 26.21 28 24 28H16C13.79 28 12 29.79 12 32V35M34 35V32C34 29.24 32.13 26.94 29.6 26.25M26 5.25C28.53 5.94 30.4 8.24 30.4 11C30.4 13.76 28.53 16.06 26 16.75M24 11C24 13.76 21.76 16 19 16C16.24 16 14 13.76 14 11C14 8.24 16.24 6 19 6C21.76 6 24 8.24 24 11Z"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6H10L13.6 25.39C13.77 26.28 14.54 26.94 15.45 26.94H30.55C31.46 26.94 32.23 26.28 32.4 25.39L34 14H12M16 34C16 34.55 15.55 35 15 35C14.45 35 14 34.55 14 34C14 33.45 14.45 33 15 33C15.55 33 16 33.45 16 34ZM32 34C32 34.55 31.55 35 31 35C30.45 35 30 34.55 30 34C30 33.45 30.45 33 31 33C31.55 33 32 33.45 32 34Z"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 8L8 32M12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14ZM28 30C29.1 30 30 29.1 30 28C30 26.9 29.1 26 28 26C26.9 26 26 26.9 26 28C26 29.1 26.9 30 28 30Z"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Grid: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,520',
  },
  decorators: [
    (Story, context) => (
      <div className="bg-black_1 p-24px rounded-16px max-w-[720px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-16px">
          <StatCard
            label="Total Revenue"
            value="$48,520"
            change={{ value: 12.5, direction: 'up' }}
            icon={<DollarIcon />}
          />
          <StatCard
            label="Active Users"
            value="2,847"
            change={{ value: 8.1, direction: 'up' }}
            icon={<UsersIcon />}
          />
          <StatCard
            label="Orders"
            value="1,024"
            change={{ value: 3.2, direction: 'down' }}
            icon={<CartIcon />}
          />
          <StatCard
            label="Conversion"
            value="3.6%"
            change={{ value: 1.4, direction: 'up' }}
            icon={<PercentIcon />}
          />
        </div>
      </div>
    ),
  ],
  render: () => <></>,
};
