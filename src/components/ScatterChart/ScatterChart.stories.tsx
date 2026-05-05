import type { Meta, StoryObj } from '@storybook/react';
import ScatterChart from './ScatterChart';
import type { ScatterChartSeries } from './types';

const sampleSeries: ScatterChartSeries[] = [
  {
    name: 'Group A',
    points: Array.from({ length: 30 }, () => ({
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
    })),
  },
  {
    name: 'Group B',
    points: Array.from({ length: 30 }, () => ({
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
      size: 4 + Math.round(Math.random() * 8),
    })),
  },
];

const meta = {
  title: 'Charts/ScatterChart',
  component: ScatterChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: sampleSeries,
    width: 600,
    height: 400,
    xLabel: 'Engagement',
    yLabel: 'Conversion',
  },
};

export const Bubble: Story = {
  args: {
    series: [sampleSeries[1]],
    width: 600,
    height: 400,
  },
};
