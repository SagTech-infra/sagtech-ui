import type { Meta, StoryObj } from '@storybook/react';
import SankeyChart from './SankeyChart';

const meta = {
  title: 'Charts/SankeyChart',
  component: SankeyChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
  },
} satisfies Meta<typeof SankeyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nodes: [
      { id: 'visit', label: 'Visit' },
      { id: 'signup', label: 'Sign-up' },
      { id: 'paid', label: 'Paid' },
      { id: 'free', label: 'Free' },
      { id: 'retain', label: 'Retained' },
      { id: 'churn', label: 'Churned' },
    ],
    links: [
      { source: 'visit', target: 'signup', value: 60 },
      { source: 'visit', target: 'free', value: 40 },
      { source: 'signup', target: 'paid', value: 35 },
      { source: 'signup', target: 'free', value: 25 },
      { source: 'paid', target: 'retain', value: 25 },
      { source: 'paid', target: 'churn', value: 10 },
      { source: 'free', target: 'retain', value: 30 },
      { source: 'free', target: 'churn', value: 35 },
    ],
    width: 700,
    height: 380,
  },
};
