import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RadioGroup from './RadioGroup';

const meta = {
  title: 'Form Controls/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    error: { control: 'text' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { label: 'Option one', value: 'one' },
  { label: 'Option two', value: 'two' },
  { label: 'Option three', value: 'three' },
];

export const Default: Story = {
  args: {
    name: 'default-radio',
    options: defaultOptions,
    value: 'one',
  },
};

export const Horizontal: Story = {
  args: {
    name: 'horizontal-radio',
    options: defaultOptions,
    value: 'two',
    orientation: 'horizontal',
  },
};

export const WithDescriptions: Story = {
  args: {
    name: 'desc-radio',
    options: [
      { label: 'Starter', value: 'starter', description: 'Best for personal projects' },
      { label: 'Pro', value: 'pro', description: 'For growing teams and businesses' },
      { label: 'Enterprise', value: 'enterprise', description: 'Custom solutions and SLA' },
    ],
    value: 'pro',
  },
};

export const WithError: Story = {
  args: {
    name: 'error-radio',
    options: defaultOptions,
    error: 'Please select an option',
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled-radio',
    options: [
      { label: 'Available', value: 'available' },
      { label: 'Unavailable', value: 'unavailable', disabled: true },
      { label: 'Also available', value: 'also-available' },
    ],
    value: 'available',
  },
};

export const Interactive: Story = {
  args: {
    name: 'interactive-radio',
    options: defaultOptions,
  },
  render: function InteractiveRadioGroup(args) {
    const [value, setValue] = useState('one');
    return <RadioGroup {...args} value={value} onChange={setValue} />;
  },
};
