import type { Meta, StoryObj } from '@storybook/react';
import TreemapChart from './TreemapChart';
import type { TreemapNode } from './types';

const sampleData: TreemapNode[] = [
  { id: 'a', label: 'Engineering', value: 420 },
  { id: 'b', label: 'Sales', value: 310 },
  { id: 'c', label: 'Design', value: 180 },
  { id: 'd', label: 'Marketing', value: 150 },
  { id: 'e', label: 'Operations', value: 120 },
  { id: 'f', label: 'Support', value: 90 },
  { id: 'g', label: 'HR', value: 70 },
  { id: 'h', label: 'Finance', value: 60 },
];

const meta = {
  title: 'Charts/TreemapChart',
  component: TreemapChart,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
    padding: { control: 'number' },
  },
} satisfies Meta<typeof TreemapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleData,
    width: 600,
    height: 400,
  },
};

export const Nested: Story = {
  args: {
    width: 600,
    height: 400,
    data: [
      {
        id: 'eng',
        label: 'Engineering',
        value: 420,
        children: [
          { id: 'eng-fe', label: 'Frontend', value: 200 },
          { id: 'eng-be', label: 'Backend', value: 220 },
        ],
      },
      {
        id: 'biz',
        label: 'Business',
        value: 460,
        children: [
          { id: 'biz-sales', label: 'Sales', value: 310 },
          { id: 'biz-mkt', label: 'Marketing', value: 150 },
        ],
      },
      { id: 'design', label: 'Design', value: 180 },
    ],
  },
};
