import { useState } from 'react';
import VisualGraphEditor, {
  type GraphNode,
  type GraphEdge,
} from '@/components/VisualGraphEditor/VisualGraphEditor';

export interface VisualGraphEditorFixtureProps {
  readOnly?: boolean;
}

/**
 * Test harness for {@link VisualGraphEditor} CT specs. Owns the node/edge state
 * (the component is controlled) and renders a DOM read-out of node "1"'s
 * position so specs can assert pointer-drag results without relying on a
 * callback crossing Playwright's Node↔browser bridge.
 */
export function VisualGraphEditorFixture({ readOnly = false }: VisualGraphEditorFixtureProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: '1', position: { x: 40, y: 80 }, data: { label: 'Start' } },
    { id: '2', position: { x: 260, y: 80 }, data: { label: 'Send' } },
    { id: '3', position: { x: 480, y: 40 }, data: { label: 'End' } },
  ]);
  const [edges, setEdges] = useState<GraphEdge[]>([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ]);

  const n1 = nodes.find((n) => n.id === '1');
  const pos = n1 ? `${Math.round(n1.position.x)},${Math.round(n1.position.y)}` : 'none';

  return (
    <div style={{ width: 600 }}>
      <div data-testid="n1-pos">{pos}</div>
      <div data-testid="node-count">{nodes.length}</div>
      <VisualGraphEditor
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        readOnly={readOnly}
        height={360}
      />
    </div>
  );
}
