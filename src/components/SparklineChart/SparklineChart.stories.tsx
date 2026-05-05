import type { Meta, StoryObj } from '@storybook/react';
import SparklineChart from './SparklineChart';

const sampleData = [12, 18, 8, 22, 16, 24, 28, 21, 30, 26, 34, 32];

const meta = {
  title: 'Charts/SparklineChart',
  component: SparklineChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    tone: { control: 'select', options: ['success', 'warning', 'error', 'neutral'] },
    showArea: { control: 'boolean' },
  },
} satisfies Meta<typeof SparklineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const WithArea: Story = {
  args: {
    data: sampleData,
    width: 120,
    height: 32,
    tone: 'success',
    showArea: true,
  },
};

export const Inline: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: '#F8F8F8', fontFamily: 'Manrope, sans-serif' }}>
      <span>Revenue <SparklineChart data={sampleData} tone="success" /> +12%</span>
      <span>Errors <SparklineChart data={[2, 1, 3, 2, 4, 5, 6]} tone="error" /> +250%</span>
    </div>
  ),
};
