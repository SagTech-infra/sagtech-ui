import type { Meta, StoryObj } from '@storybook/react';
import TextArea from './TextArea';

const meta = {
  title: 'Form Controls/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active'],
    },
    isError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    errorMessage: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    rows: 4,
  },
};

export const Active: Story = {
  args: {
    state: 'active',
    value: 'This is an active textarea with content.',
    rows: 4,
  },
};

export const Error: Story = {
  args: {
    isError: true,
    errorMessage: 'Message is required',
    placeholder: 'Enter your message...',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
    rows: 4,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <TextArea placeholder="Default state" rows={3} />
      <TextArea state="active" value="Active state with content" rows={3} />
      <TextArea isError errorMessage="This field is required" placeholder="Error state" rows={3} />
      <TextArea disabled placeholder="Disabled state" rows={3} />
    </div>
  ),
};
