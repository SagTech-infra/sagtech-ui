import type { Meta, StoryObj } from '@storybook/react';
import Alert from './Alert';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-130">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'radio', options: ['info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'New version available',
    children: 'We just shipped v2.4.0. Refresh to get the latest features.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    children: 'Your profile has been updated.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Disk space running low',
    children: 'Less than 10% of your plan quota remains. Upgrade to avoid service interruption.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Payment failed',
    children: 'Please update your billing details and retry.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Password expires in 3 days',
    action: <Button text="Update" variant="primary" buttonSize="small" />,
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'Tip',
    children: 'You can drag columns to reorder them.',
    onClose: () => alert('Dismissed'),
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'error',
    title: 'Invalid email format',
  },
};

export const BodyOnly: Story = {
  args: {
    variant: 'info',
    children: 'Anonymous telemetry helps us improve the product. You can disable it in Settings.',
  },
};
