import type { Meta, StoryObj } from '@storybook/react';
import FunnelChart from './FunnelChart';
import type { FunnelStage } from './types';

const sampleStages: FunnelStage[] = [
  { label: 'Visited', value: 1000 },
  { label: 'Sign-ups', value: 620 },
  { label: 'Activated', value: 380 },
  { label: 'Subscribed', value: 145 },
  { label: 'Renewed', value: 92 },
];

const meta = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
    showPercents: { control: 'boolean' },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stages: sampleStages,
    width: 500,
    height: 400,
  },
};

export const Horizontal: Story = {
  args: {
    stages: sampleStages,
    width: 700,
    height: 280,
    orientation: 'horizontal',
  },
};
