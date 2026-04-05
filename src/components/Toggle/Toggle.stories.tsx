import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Toggle from './Toggle';

const meta = {
  title: 'Form Controls/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: function InteractiveToggle(args) {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
  },
  render: function LabelToggle(args) {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Sizes: Story = {
  args: {},
  render: function SizesToggle() {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);
    return (
      <div className="flex flex-col gap-16px">
        <Toggle size="sm" checked={sm} onChange={setSm} label="Small" />
        <Toggle size="md" checked={md} onChange={setMd} label="Medium" />
      </div>
    );
  },
};
