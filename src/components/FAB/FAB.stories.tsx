import type { Meta, StoryObj } from '@storybook/react';
import FAB from './FAB';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'Layout/FAB',
  component: FAB,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    position: {
      control: 'radio',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    },
    extended: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    offset: { control: 'number' },
  },
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <PlusIcon />,
    'aria-label': 'Create new',
    position: 'bottom-right',
  },
};

export const Extended: Story = {
  args: {
    icon: <PlusIcon />,
    label: 'Create',
    extended: true,
    position: 'bottom-right',
  },
};

export const Loading: Story = {
  args: {
    icon: <PlusIcon />,
    label: 'Saving',
    extended: true,
    loading: true,
    position: 'bottom-right',
  },
};

export const Disabled: Story = {
  args: {
    icon: <PlusIcon />,
    'aria-label': 'Disabled action',
    disabled: true,
    position: 'bottom-right',
  },
};

export const ChatBottomLeft: Story = {
  args: {
    icon: <ChatIcon />,
    'aria-label': 'Open chat',
    position: 'bottom-left',
    offset: 32,
  },
};
