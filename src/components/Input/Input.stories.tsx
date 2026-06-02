import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta = {
  title: 'Form Controls/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active'],
    },
    isError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    floatingLabel: { control: 'text' },
    label: { control: 'text' },
    errorMessage: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
    name: 'name',
  },
};

export const WithLabel: Story = {
  args: {
    placeholder: 'Enter your email',
    label: 'Email address',
    name: 'email',
  },
};

export const Active: Story = {
  args: {
    state: 'active',
    floatingLabel: 'Name',
    value: 'John Doe',
    name: 'name',
  },
};

export const Error: Story = {
  args: {
    isError: true,
    errorMessage: 'This field is required',
    placeholder: 'Enter your name',
    name: 'name',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    name: 'disabled',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <Input placeholder="Default state" name="default" />
      <Input state="active" floatingLabel="Active Label" value="Active value" name="active" />
      <Input isError errorMessage="Error message" placeholder="Error state" name="error" />
      <Input disabled placeholder="Disabled state" name="disabled" />
      <Input label="With label" placeholder="Has external label" name="labeled" />
    </div>
  ),
};
