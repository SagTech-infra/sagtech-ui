import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import VisualGraphEditor, { type GraphNode, type GraphEdge } from './VisualGraphEditor';

const meta = {
  title: 'Data Display/VisualGraphEditor',
  component: VisualGraphEditor,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof VisualGraphEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialNodes: GraphNode[] = [
  { id: '1', position: { x: 40, y: 80 }, data: { label: 'Start' } },
  { id: '2', position: { x: 260, y: 80 }, data: { label: 'Send message' } },
  { id: '3', position: { x: 480, y: 40 }, data: { label: 'Wait for reply' } },
  { id: '4', position: { x: 480, y: 160 }, data: { label: 'Fallback email' } },
  { id: '5', position: { x: 720, y: 100 }, data: { label: 'End' } },
];

const initialEdges: GraphEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
];

export const Basic: Story = {
  render: function BasicStory() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    return (
      <div className="w-[900px]">
        <VisualGraphEditor
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: () => {},
    onEdgesChange: () => {},
    readOnly: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[900px]">
        <Story />
      </div>
    ),
  ],
};
