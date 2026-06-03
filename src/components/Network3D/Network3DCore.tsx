// No 'use client' directive here: this core is reached only via React.lazy()
// from the client wrapper (Network3D.tsx), which owns the client boundary.
// Keeping the directive off the split chunk avoids esbuild's "directive ignored"
// build warning.
import { useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as tokens from '@/tokens/tokens';
import type { Network3DProps, Network3DNode, Network3DLink } from './types';

/**
 * Heavy core for {@link Network3D}. Imported lazily by the wrapper via
 * `React.lazy(() => import('./Network3DCore'))` so the `react-force-graph-3d`
 * peer is split into an async chunk and stays out of the consumer's initial
 * bundle until a graph is actually rendered.
 */
export default function Network3DCore({
  nodes,
  links,
  width = 600,
  height = 400,
  nodeColor,
  linkColor,
  enableNodeDrag = true,
  onNodeClick,
  backgroundColor = tokens.colors.black_1,
}: Network3DProps) {
  const data = useMemo(() => ({ nodes, links }), [nodes, links]);

  const resolveNodeColor = useMemo(
    () => (n: Network3DNode) => {
      if (nodeColor) return nodeColor(n);
      if (n.color) return n.color;
      return tokens.colors.pr_purple;
    },
    [nodeColor],
  );

  const resolveLinkColor = useMemo(
    () => (l: Network3DLink) => {
      if (linkColor) return linkColor(l);
      return tokens.colors.grey_3;
    },
    [linkColor],
  );

  return (
    <ForceGraph3D
      graphData={data}
      width={width as number}
      height={height as number}
      backgroundColor={backgroundColor}
      nodeLabel={(n: Network3DNode) => n.label ?? n.id}
      nodeColor={resolveNodeColor}
      linkColor={resolveLinkColor}
      enableNodeDrag={enableNodeDrag}
      onNodeClick={onNodeClick ? (n) => onNodeClick(n as Network3DNode) : undefined}
      linkOpacity={0.55}
      nodeRelSize={5}
      showNavInfo={false}
    />
  );
}
