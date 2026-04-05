import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Checkbox from './Checkbox';

const meta = {
  title: 'Form Controls/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: 'checkbox', label: 'I agree to the terms and conditions', checked: false },
};

export const Checked: Story = {
  args: { type: 'checkbox', label: 'I agree to the terms and conditions', checked: true },
};

export const Interactive: Story = {
  args: { type: 'checkbox', label: 'Click me to toggle' },
  render: function InteractiveCheckbox(args) {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
    );
  },
};
