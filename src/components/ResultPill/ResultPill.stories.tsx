import type { Meta, StoryObj } from '@storybook/react';
import ResultPill from './ResultPill';

const meta = {
  title: 'Data Display/ResultPill',
  component: ResultPill,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    info: { control: 'text' },
  },
} satisfies Meta<typeof ResultPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '150+',
    info: 'Projects Delivered',
  },
};

export const WithLongText: Story = {
  args: {
    title: '99.9%',
    info: 'Client satisfaction rate across all engagements',
  },
};

export const MultipleResults: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', maxWidth: '800px' }}>
      <ResultPill title="150+" info="Projects Delivered" />
      <ResultPill title="50+" info="Team Members" />
      <ResultPill title="99.9%" info="Uptime Guarantee" />
    </div>
  ),
};
