import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Children, createElement } from 'react';

// ---------------------------------------------------------------------------
// Adapter-logic tests (separate file so the ReactFlow mock is file-scoped and
// does not affect the structural mount tests in VisualGraphEditor.test.tsx).
//
// Strategy: replace ONLY `ReactFlow` with a stub that captures the props it
// receives (so we can invoke the change/connect/click handlers directly), while
// keeping the real `applyNodeChanges` / `applyEdgeChanges` / `addEdge` /
// `ReactFlowProvider` via importOriginal — the adapter logic under test stays
// real, only the layout-dependent renderer is stubbed. This removes happy-dom's
// missing-layout problem without faking the logic.
// ---------------------------------------------------------------------------

const h = vi.hoisted(() => ({ captured: null as Record<string, unknown> | null }));

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>();
  return {
    ...actual,
    ReactFlow: (props: Record<string, unknown>) => {
      h.captured = props;
      return createElement('div', { className: 'react-flow' });
    },
  };
});

import VisualGraphEditor from '../VisualGraphEditor';
import type { GraphNode, GraphEdge } from '../VisualGraphEditor';

const NODES: GraphNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
  { id: '2', position: { x: 200, y: 0 }, data: { label: 'Node B' } },
];
const EDGES: GraphEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cap = () => h.captured as any;

beforeEach(() => {
  h.captured = null;
});

describe('VisualGraphEditor — change adapters', () => {
  it('onNodesChange applies the change and passes the resulting array', () => {
    const onNodesChange = vi.fn();
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={onNodesChange}
        onEdgesChange={vi.fn()}
      />,
    );
    cap().onNodesChange([{ type: 'remove', id: '1' }]);
    expect(onNodesChange).toHaveBeenCalledTimes(1);
    const result = onNodesChange.mock.calls[0][0] as GraphNode[];
    expect(result).toHaveLength(1);
    expect(result.find((n) => n.id === '1')).toBeUndefined();
  });

  it('onEdgesChange applies the change and passes the resulting array', () => {
    const onEdgesChange = vi.fn();
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={onEdgesChange}
      />,
    );
    cap().onEdgesChange([{ type: 'remove', id: 'e1-2' }]);
    expect(onEdgesChange).toHaveBeenCalledTimes(1);
    expect(onEdgesChange.mock.calls[0][0]).toHaveLength(0);
  });

  it('onConnect adds a new edge via addEdge', () => {
    const onEdgesChange = vi.fn();
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={onEdgesChange}
      />,
    );
    cap().onConnect({ source: '2', target: '1', sourceHandle: null, targetHandle: null });
    expect(onEdgesChange).toHaveBeenCalledTimes(1);
    expect(onEdgesChange.mock.calls[0][0]).toHaveLength(2);
  });

  it('forwards onNodeClick with the clicked node', () => {
    const onNodeClick = vi.fn();
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        onNodeClick={onNodeClick}
      />,
    );
    cap().onNodeClick({} as MouseEvent, NODES[0]);
    expect(onNodeClick).toHaveBeenCalledTimes(1);
    expect(onNodeClick.mock.calls[0][0]).toEqual(NODES[0]);
  });

  it('passes nodeTypes and edgeTypes through to ReactFlow', () => {
    const nodeTypes = { custom: () => null };
    const edgeTypes = { custom: () => null };
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />,
    );
    expect(cap().nodeTypes).toBe(nodeTypes);
    expect(cap().edgeTypes).toBe(edgeTypes);
  });
});

describe('VisualGraphEditor — readOnly guards', () => {
  it('does not call onNodesChange when readOnly', () => {
    const onNodesChange = vi.fn();
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={onNodesChange}
        onEdgesChange={vi.fn()}
        readOnly
      />,
    );
    cap().onNodesChange([{ type: 'remove', id: '1' }]);
    expect(onNodesChange).not.toHaveBeenCalled();
    // readOnly also disables interaction flags on ReactFlow.
    expect(cap().nodesDraggable).toBe(false);
    expect(cap().nodesConnectable).toBe(false);
  });

  it('does not call onEdgesChange or onConnect when readOnly', () => {
    const onEdgesChange = vi.fn();
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={onEdgesChange}
        readOnly
      />,
    );
    cap().onEdgesChange([{ type: 'remove', id: 'e1-2' }]);
    cap().onConnect({ source: '2', target: '1', sourceHandle: null, targetHandle: null });
    expect(onEdgesChange).not.toHaveBeenCalled();
  });
});

describe('VisualGraphEditor — overlay toggles', () => {
  it('renders Background + Controls + MiniMap by default (3 children)', () => {
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
      />,
    );
    // React.Children.toArray drops falsy entries, so the count reflects which
    // overlays were rendered: Background + Controls + MiniMap.
    expect(Children.toArray(cap().children)).toHaveLength(3);
  });

  it('omits Background and MiniMap when toggled off (Controls only)', () => {
    render(
      <VisualGraphEditor
        nodes={NODES}
        edges={EDGES}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        showMiniMap={false}
        showBackground={false}
      />,
    );
    expect(Children.toArray(cap().children)).toHaveLength(1);
  });
});
