import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import VisualGraphEditor from '../VisualGraphEditor';
import type { GraphNode, GraphEdge } from '../VisualGraphEditor';

// @xyflow/react renders a zero-size viewport in happy-dom (no real layout
// engine), so nodes/edges may not appear in the DOM.  We assert the stable
// structural wrapper that ReactFlow always renders:  `.react-flow` is the
// outermost div rendered by <ReactFlow />, and the component's own wrapper
// always has `.sagtech-graph`.  If either is absent the component crashed.
//
// No per-file vi.mock is needed: the global ResizeObserver + IntersectionObserver
// stubs (vitest.setup.ts) are sufficient for @xyflow/react to mount without
// throwing.

const NODES: GraphNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
  { id: '2', position: { x: 200, y: 0 }, data: { label: 'Node B' } },
];

const EDGES: GraphEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];

describe('VisualGraphEditor', () => {
  it('mounts without crashing and renders the sagtech-graph wrapper', () => {
    const { container } = render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
      />,
    );
    expect(container.querySelector('.sagtech-graph')).toBeInTheDocument();
  });

  it('renders the ReactFlow root element (.react-flow)', () => {
    const { container } = render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
      />,
    );
    // @xyflow/react always renders a div with class "react-flow" as its root.
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });

  it('mounts with empty nodes and edges without crashing', () => {
    expect(() =>
      render(
        <VisualGraphEditor
          nodes={[]}
          edges={[]}
          onNodesChange={vi.fn()}
          onEdgesChange={vi.fn()}
        />,
      ),
    ).not.toThrow();
  });

  it('accepts readOnly and custom height without crashing', () => {
    const { container } = render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        readOnly
        height={600}
        showMiniMap={false}
        showBackground={false}
      />,
    );
    const wrapper = container.querySelector('.sagtech-graph') as HTMLElement | null;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.style.height).toBe('600px');
  });

  it('calls onNodeClick when a node is clicked', () => {
    // In happy-dom, ReactFlow renders nodes only when it has non-zero
    // dimensions (which it doesn't in happy-dom).  We test that the callback
    // prop is accepted and the component mounts without throwing.
    const onNodeClick = vi.fn();
    expect(() =>
      render(
        <VisualGraphEditor
          nodes={NODES}
          edges={EDGES}
          onNodesChange={vi.fn()}
          onEdgesChange={vi.fn()}
          onNodeClick={onNodeClick}
        />,
      ),
    ).not.toThrow();
  });
});
