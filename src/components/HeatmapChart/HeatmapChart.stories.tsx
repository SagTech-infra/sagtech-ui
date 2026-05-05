import type { Meta, StoryObj } from '@storybook/react';
import HeatmapChart from './HeatmapChart';
import type { HeatmapDatum } from './types';

const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const yLabels = ['Morning', 'Noon', 'Evening', 'Night'];

const sampleData: HeatmapDatum[] = (() => {
  const out: HeatmapDatum[] = [];
  for (let yi = 0; yi < yLabels.length; yi++) {
    for (let xi = 0; xi < xLabels.length; xi++) {
      out.push({ x: xLabels[xi], y: yLabels[yi], value: Math.round(Math.random() * 100) });
    }
  }
  return out;
})();

const meta = {
  title: 'Charts/HeatmapChart',
  component: HeatmapChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
  },
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleData,
    xLabels,
    yLabels,
    width: 700,
    height: 320,
  },
};

export const CustomScale: Story = {
  args: {
    data: sampleData,
    xLabels,
    yLabels,
    width: 700,
    height: 320,
    colorScale: ['#0E1620', '#58A61B'],
  },
};
