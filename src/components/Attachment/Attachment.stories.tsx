import type { Meta, StoryObj } from '@storybook/react';
import { Attachment } from './Attachment';

const meta = {
  title: 'Form Controls/Attachment',
  component: Attachment,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active', 'disabled'],
    },
    isError: { control: 'boolean' },
    multiple: { control: 'boolean' },
    title: { control: 'text' },
    errorMessage: {
      control: 'select',
      options: ['type', 'size', 'quantity'],
    },
  },
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: 'default', title: 'Attach file' },
};

export const Active: Story = {
  args: { state: 'active', title: 'Attach file' },
};

export const Disabled: Story = {
  args: { state: 'disabled', title: 'Attach file' },
};

export const ErrorType: Story = {
  args: { state: 'default', isError: true, errorMessage: 'type', title: 'Attach file' },
};

export const ErrorSize: Story = {
  args: { state: 'default', isError: true, errorMessage: 'size', title: 'Attach file' },
};

export const ErrorQuantity: Story = {
  args: { state: 'default', isError: true, errorMessage: 'quantity', title: 'Attach file' },
};
