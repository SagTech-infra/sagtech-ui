'use client';

import { useMemo } from 'react';
import classNames from 'classnames';
import ForceGraph3D from 'react-force-graph-3d';
import * as tokens from '@/tokens/tokens';
import type { Network3DProps, Network3DNode, Network3DLink } from './types';

/**
 * 3D force-directed graph backed by `react-force-graph-3d`. The peer is
 * declared `optional: true` in `package.json#peerDependenciesMeta`, so
 * consumers who don't render this component pay zero bundle bytes for it.
 *
 * If the peer is missing the module-level import will throw at consume time
 * with a clear bundler error — this matches the pattern of every other
 * optional-peer component in this library (e.g. `RichTextEditor`).
 */
export default function Network3D({
  nodes,
  links,
  width = 600,
  height = 400,
  nodeColor,
  linkColor,
  enableNodeDrag = true,
  onNodeClick,
  backgroundColor = tokens.colors.black_1,
  className,
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
    <div
      className={classNames('sagtech-network3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background: backgroundColor }}
    >
      <ForceGraph3D
        graphData={data}
        width={width}
        height={height}
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
    </div>
  );
}
