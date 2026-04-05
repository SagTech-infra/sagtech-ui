import type { Meta, StoryObj } from '@storybook/react';
import LineChart from './LineChart';
import type { LineChartSeriesType } from './types';

const sampleSeries: LineChartSeriesType[] = [
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
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: sampleSeries,
    width: 600,
    height: 350,
  },
};

export const SingleSeries: Story = {
  args: {
    series: [sampleSeries[0]],
    width: 600,
    height: 350,
  },
};
