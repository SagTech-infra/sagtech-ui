'use client';

import { useCallback } from 'react';
import classNames from 'classnames';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export type { Node as GraphNode, Edge as GraphEdge } from '@xyflow/react';

export interface VisualGraphEditorProps<NData extends Record<string, unknown> = Record<string, unknown>, EData extends Record<string, unknown> = Record<string, unknown>> {
  nodes: Node<NData>[];
  edges: Edge<EData>[];
  onNodesChange: (nodes: Node<NData>[]) => void;
  onEdgesChange: (edges: Edge<EData>[]) => void;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  onNodeClick?: (node: Node<NData>) => void;
  readOnly?: boolean;
  showMiniMap?: boolean;
  showBackground?: boolean;
  className?: string;
  height?: number | string;
}

function VisualGraphEditorInner<NData extends Record<string, unknown>, EData extends Record<string, unknown>>({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  edgeTypes,
  onNodeClick,
  readOnly = false,
  showMiniMap = true,
  showBackground = true,
  className,
  height = 520,
}: VisualGraphEditorProps<NData, EData>) {
  const handleNodesChange = useCallback(
    (changes: NodeChange<Node<NData>>[]) => {
      if (readOnly) return;
      onNodesChange(applyNodeChanges<Node<NData>>(changes, nodes));
    },
    [nodes, onNodesChange, readOnly],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<Edge<EData>>[]) => {
      if (readOnly) return;
      onEdgesChange(applyEdgeChanges<Edge<EData>>(changes, edges));
    },
    [edges, onEdgesChange, readOnly],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return;
      onEdgesChange(addEdge(connection, edges) as Edge<EData>[]);
    },
    [edges, onEdgesChange, readOnly],
  );

  return (
    <div
      className={classNames(
        'sagtech-graph bg-black_2 border border-solid border-black_3 rounded-16px overflow-hidden',
        className,
      )}
      style={{ height }}
    >
      <style>{`
        .sagtech-graph .react-flow__node { color: #F8F8F8; font-family: var(--font-manrope), sans-serif; }
        .sagtech-graph .react-flow__handle { background: #6D3EF1; border-color: #070715; }
        .sagtech-graph .react-flow__edge-path { stroke: #6D3EF1; }
        .sagtech-graph .react-flow__controls { background: #20202D; border-radius: 8px; overflow: hidden; border: 1px solid #393944; }
        .sagtech-graph .react-flow__controls-button { background: #20202D; color: #CDCDD0; border-color: #393944; }
        .sagtech-graph .react-flow__controls-button:hover { background: #393944; }
        .sagtech-graph .react-flow__minimap { background: #20202D; }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={(_, node) => onNodeClick?.(node as Node<NData>)}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        edgesReconnectable={!readOnly}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        {showBackground && <Background color="#393944" gap={16} />}
        <Controls />
        {showMiniMap && <MiniMap pannable zoomable nodeColor="#6D3EF1" />}
      </ReactFlow>
    </div>
  );
}

export default function VisualGraphEditor<NData extends Record<string, unknown> = Record<string, unknown>, EData extends Record<string, unknown> = Record<string, unknown>>(
  props: VisualGraphEditorProps<NData, EData>,
) {
  return (
    <ReactFlowProvider>
      <VisualGraphEditorInner {...props} />
    </ReactFlowProvider>
  );
}
