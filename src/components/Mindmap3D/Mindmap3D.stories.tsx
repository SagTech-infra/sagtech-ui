import type { Meta, StoryObj } from '@storybook/react';
import Mindmap3D from './Mindmap3D';
import type { MindmapNode } from './types';

const meta = {
  title: '3D/Mindmap3D',
  component: Mindmap3D,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Mindmap3D>;

export default meta;
type Story = StoryObj<typeof meta>;

const tree: MindmapNode = {
  id: 'root',
  label: 'Product',
  children: [
    {
      id: 'design',
      label: 'Design',
      children: [
        { id: 'tokens', label: 'Tokens' },
        { id: 'comps', label: 'Components' },
      ],
    },
    {
      id: 'eng',
      label: 'Engineering',
      children: [
        { id: 'fe', label: 'Frontend' },
        { id: 'be', label: 'Backend' },
        { id: 'infra', label: 'Infra' },
      ],
    },
    {
      id: 'gtm',
      label: 'Go-to-market',
      children: [
        { id: 'sales', label: 'Sales' },
        { id: 'mkt', label: 'Marketing' },
      ],
    },
  ],
};

export const Basic: Story = {
  args: {
    root: tree,
    height: 500,
    onNodeClick: (n) => console.log('clicked node', n),
  },
};
