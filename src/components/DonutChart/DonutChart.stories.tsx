import type { Meta, StoryObj } from '@storybook/react';
import DonutChart from './DonutChart';

const sampleColors = [
  { bgColor: '#6D3EF1', color: '#FFFFFF' },
  { bgColor: '#9271EE', color: '#FFFFFF' },
  { bgColor: '#CBBCF8', color: '#000000' },
  { bgColor: '#4A2AAF', color: '#FFFFFF' },
  { bgColor: '#E0D6FC', color: '#000000' },
];

const meta = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'number' },
    size: { control: { type: 'range', min: 20, max: 90 } },
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: [35, 25, 20, 12, 8],
    colors: sampleColors,
    size: 65,
    width: 300,
    labels: ['React', 'Node.js', 'Python', 'Go', 'Other'],
  },
};

export const EqualDistribution: Story = {
  args: {
    value: [20, 20, 20, 20, 20],
    colors: sampleColors,
    size: 65,
    width: 300,
    labels: ['React', 'Node.js', 'Python', 'Go', 'Other'],
  },
};

export const ThinDonut: Story = {
  args: {
    value: [35, 25, 20, 12, 8],
    colors: sampleColors,
    size: 85,
    width: 300,
    labels: ['React', 'Node.js', 'Python', 'Go', 'Other'],
  },
};

export const ThickDonut: Story = {
  args: {
    value: [35, 25, 20, 12, 8],
    colors: sampleColors,
    size: 40,
    width: 300,
    labels: ['React', 'Node.js', 'Python', 'Go', 'Other'],
  },
};
