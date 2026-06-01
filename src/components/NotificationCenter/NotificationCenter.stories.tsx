import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import NotificationCenter, { type NotificationItem } from './NotificationCenter';
import { LocaleProvider } from '@/providers/LocaleProvider';

const meta = {
  title: 'Feedback/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-[520px] min-h-[520px] py-32px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Date.now();

const sample: NotificationItem[] = [
  {
    id: '1',
    title: 'New teammate joined',
    description: 'Alan Turing was added to the Engineering team.',
    variant: 'info',
    timestamp: now - 2 * 60 * 1000,
    read: false,
  },
  {
    id: '2',
    title: 'Deploy succeeded',
    description: 'Build #482 shipped to production.',
    variant: 'success',
    timestamp: now - 35 * 60 * 1000,
    read: false,
  },
  {
    id: '3',
    title: 'Disk almost full',
    description: 'Only 8% of storage quota remaining on prod-db-01.',
    variant: 'warning',
    timestamp: now - 4 * 60 * 60 * 1000,
    read: true,
    href: '#',
  },
  {
    id: '4',
    title: 'Payment failed',
    description: 'Your card ending in 4242 was declined. Update billing to avoid interruption.',
    variant: 'error',
    timestamp: now - 26 * 60 * 60 * 1000,
    read: true,
  },
];

export const Default: Story = {
  render: function DefaultStory() {
    const [items, setItems] = useState(sample);
    return (
      <NotificationCenter
        notifications={items}
        onMarkRead={(id) =>
          setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }
        onMarkAllRead={() =>
          setItems((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setItems([])}
        onNotificationClick={(n) => console.log('Clicked', n)}
      />
    );
  },
};

export const AllRead: Story = {
  args: {
    notifications: sample.map((n) => ({ ...n, read: true })),
  },
};

export const Empty: Story = {
  args: {
    notifications: [],
    emptyMessage: 'You are all caught up.',
  },
};

export const ManyUnread: Story = {
  args: {
    notifications: Array.from({ length: 128 }, (_, i) => ({
      id: String(i),
      title: `Notification ${i + 1}`,
      description: 'Lorem ipsum dolor sit amet consectetur.',
      variant: (['info', 'success', 'warning', 'error'] as const)[i % 4],
      timestamp: now - i * 15 * 60 * 1000,
      read: false,
    })),
  },
};

export const PositionLeft: Story = {
  args: {
    notifications: sample,
    position: 'left',
  },
};

export const RTL: Story = {
  args: {
    notifications: sample,
  },
  render: function RtlStory(args) {
    return (
      <LocaleProvider locale="ar-EG" dir="rtl">
        <NotificationCenter {...args} />
      </LocaleProvider>
    );
  },
};
