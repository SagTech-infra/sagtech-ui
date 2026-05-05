import type { Meta, StoryObj } from '@storybook/react';
import GaugeChart from './GaugeChart';

const meta = {
  title: 'Charts/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    min: { control: 'number' },
    max: { control: 'number' },
    width: { control: 'number' },
    height: { control: 'number' },
    showValue: { control: 'boolean' },
  },
} satisfies Meta<typeof GaugeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 72,
    label: 'Performance',
  },
};

export const WithThresholds: Story = {
  args: {
    value: 65,
    label: 'CPU',
    thresholds: [
      { value: 40, color: '#58A61B' },
      { value: 75, color: '#C6A328' },
      { value: 100, color: '#992D2D' },
    ],
  },
};

export const Large: Story = {
  args: {
    value: 88,
    width: 320,
    height: 180,
    label: 'Score',
  },
};
