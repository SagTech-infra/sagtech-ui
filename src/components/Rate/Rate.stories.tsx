import type { Meta, StoryObj } from '@storybook/react';
import Rate from './Rate';

const meta = {
  title: 'Data Display/Rate',
  component: Rate,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Rate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = { args: { value: 5, label: 'AI match' } };
export const Half: Story = { args: { value: 3.5, label: 'Candidate quality' } };
export const Low: Story = { args: { value: 1.2, label: 'Response time' } };
export const Custom: Story = { args: { value: 7, max: 10, label: 'NPS', tone: 'success' } };
