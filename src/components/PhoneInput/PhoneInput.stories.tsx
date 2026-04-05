import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import PhoneInput from './PhoneInput';

const meta = {
  title: 'Form Controls/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    externalLabel: { control: 'text' },
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultPhone() {
    const [value, setValue] = useState('');
    return <PhoneInput value={value} onChange={setValue} />;
  },
};

export const WithLabel: Story = {
  render: function LabeledPhone() {
    const [value, setValue] = useState('');
    return (
      <PhoneInput
        value={value}
        onChange={setValue}
        externalLabel="Phone number"
        name="phone"
      />
    );
  },
};

export const WithError: Story = {
  render: function ErrorPhone() {
    const [value, setValue] = useState('');
    return (
      <PhoneInput
        value={value}
        onChange={setValue}
        externalLabel="Phone number"
        name="phone"
        error
      />
    );
  },
};
