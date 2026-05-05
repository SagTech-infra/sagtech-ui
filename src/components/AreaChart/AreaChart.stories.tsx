import type { Meta, StoryObj } from '@storybook/react';
import AreaChart from './AreaChart';
import type { AreaChartSeries } from './types';

const sampleSeries: AreaChartSeries[] = [
  {
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 30 },
      { x: 'Feb', y: 40 },
      { x: 'Mar', y: 35 },
      { x: 'Apr', y: 50 },
      { x: 'May', y: 49 },
      { x: 'Jun', y: 60 },
    ],
  },
  {
    name: 'Expenses',
    data: [
      { x: 'Jan', y: 20 },
      { x: 'Feb', y: 25 },
      { x: 'Mar', y: 22 },
      { x: 'Apr', y: 30 },
      { x: 'May', y: 28 },
      { x: 'Jun', y: 35 },
    ],
  },
];

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
    stacked: { control: 'boolean' },
    gradient: { control: 'boolean' },
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: sampleSeries,
    width: 600,
    height: 350,
  },
};

export const Stacked: Story = {
  args: {
    series: sampleSeries,
    width: 600,
    height: 350,
    stacked: true,
  },
};

export const NoGradient: Story = {
  args: {
    series: [sampleSeries[0]],
    width: 600,
    height: 350,
    gradient: false,
  },
};
