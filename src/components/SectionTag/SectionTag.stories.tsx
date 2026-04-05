import type { Meta, StoryObj } from '@storybook/react';
import SectionTag from './SectionTag';

const meta = {
  title: 'Layout/SectionTag',
  component: SectionTag,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
  },
} satisfies Meta<typeof SectionTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Section Tag',
  },
};

export const Middle: Story = {
  args: {
    size: 'middle',
    children: 'Section Tag',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Section Tag',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SectionTag size="small">Small</SectionTag>
      <SectionTag size="middle">Middle</SectionTag>
      <SectionTag size="large">Large</SectionTag>
    </div>
  ),
};
