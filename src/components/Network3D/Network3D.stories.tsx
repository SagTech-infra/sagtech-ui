import type { Meta, StoryObj } from '@storybook/react';
import Network3D from './Network3D';
import type { Network3DNode, Network3DLink } from './types';

const meta = {
  title: 'Data Display/Network3D',
  component: Network3D,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 600, height: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Network3D>;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes: Network3DNode[] = [
  { id: 'a', label: 'Alpha', group: 1 },
  { id: 'b', label: 'Beta', group: 1 },
  { id: 'c', label: 'Gamma', group: 2 },
  { id: 'd', label: 'Delta', group: 2 },
  { id: 'e', label: 'Epsilon', group: 3 },
  { id: 'f', label: 'Zeta', group: 3 },
  { id: 'g', label: 'Eta', group: 1 },
  { id: 'h', label: 'Theta', group: 2 },
  { id: 'i', label: 'Iota', group: 3 },
];

const links: Network3DLink[] = [
  { source: 'a', target: 'b', value: 1 },
  { source: 'a', target: 'c', value: 2 },
  { source: 'b', target: 'd', value: 1 },
  { source: 'c', target: 'd', value: 1 },
  { source: 'c', target: 'e', value: 3 },
  { source: 'd', target: 'f', value: 1 },
  { source: 'e', target: 'f', value: 2 },
  { source: 'a', target: 'g', value: 1 },
  { source: 'g', target: 'h', value: 2 },
  { source: 'h', target: 'i', value: 1 },
  { source: 'f', target: 'i', value: 1 },
];

export const Basic: Story = {
  args: {
    nodes,
    links,
    width: 600,
    height: 400,
    onNodeClick: (n) => console.log('clicked node', n),
  },
};
