import type { Meta, StoryObj } from '@storybook/react';
import RadarChart from './RadarChart';
import type { RadarChartSeries } from './types';

const axes = ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Looks'];

const sampleSeries: RadarChartSeries[] = [
  { name: 'Model A', values: [80, 70, 85, 90, 60, 75] },
  { name: 'Model B', values: [60, 90, 70, 75, 85, 65] },
];

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
    showGrid: { control: 'boolean' },
    fill: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: sampleSeries,
    axes,
    width: 500,
    height: 400,
  },
};

export const SingleSeries: Story = {
  args: {
    series: [sampleSeries[0]],
    axes,
    width: 500,
    height: 400,
  },
};
