'use client';

import { useMemo } from 'react';
import classNames from 'classnames';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as tokens from '@/tokens/tokens';
import type { Mindmap3DProps, MindmapNode } from './types';

/**
 * Hierarchical 3D mindmap. Backed by `@react-three/fiber` + `@react-three/drei`
 * + `three` (all optional peers).
 *
 * Layout: root at origin. Level-1 children spread on a ring in the z=0 plane.
 * Deeper levels project on cones radiating outward from each parent, with a
 * small lift in y so siblings don't overlap when projected to the camera.
 */
interface PlacedNode {
  node: MindmapNode;
  position: [number, number, number];
  parent?: PlacedNode;
  depth: number;
}

function layoutTree(root: MindmapNode): PlacedNode[] {
  const placed: PlacedNode[] = [];

  const placeNode = (
    node: MindmapNode,
    position: [number, number, number],
    parent: PlacedNode | undefined,
    depth: number,
    parentAngle: number,
  ) => {
    const self: PlacedNode = { node, position, parent, depth };
    placed.push(self);

    if (!node.children?.length) return;

    const count = node.children.length;
    const radius = depth === 0 ? 3 : 1.6;
    const yStep = depth === 0 ? 0 : 0.7;
    const arcSpread = depth === 0 ? Math.PI * 2 : Math.PI * 0.9;

    node.children.forEach((child, i) => {
      const angle =
        depth === 0
          ? (i / count) * Math.PI * 2
          : parentAngle + (i / Math.max(count - 1, 1) - 0.5) * arcSpread;
      const dx = Math.cos(angle) * radius;
      const dz = Math.sin(angle) * radius;
      const dy = depth === 0 ? 0 : yStep;
      const childPos: [number, number, number] = [
        position[0] + dx,
        position[1] + dy,
        position[2] + dz,
      ];
      placeNode(child, childPos, self, depth + 1, angle);
    });
  };

  placeNode(root, [0, 0, 0], undefined, 0, 0);
  return placed;
}

interface SceneProps {
  placed: PlacedNode[];
  onNodeClick?: (n: MindmapNode) => void;
  edgeColor: string;
}

function MindmapScene({ placed, onNodeClick, edgeColor }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, 4]} intensity={0.6} color={tokens.colors.sec_purple} />

      {/* Edges */}
      {placed
        .filter((p) => p.parent)
        .map((p, i) => (
          <Line
            key={`edge-${i}`}
            points={[p.parent!.position, p.position]}
            color={edgeColor}
            lineWidth={1.5}
            transparent
            opacity={0.7}
          />
        ))}

      {/* Nodes */}
      {placed.map((p, i) => {
        const size = p.depth === 0 ? 0.32 : p.depth === 1 ? 0.22 : 0.16;
        const color = p.node.color ?? (p.depth === 0 ? tokens.colors.pr_purple : tokens.colors.sec_purple);
        return (
          <group key={`node-${i}`} position={p.position}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onNodeClick?.(p.node);
              }}
            >
              <sphereGeometry args={[size, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: p.depth === 0 ? 13 : 11,
                  fontWeight: p.depth === 0 ? 700 : 500,
                  color: tokens.colors.white_4,
                  background: 'rgba(7, 7, 21, 0.85)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  transform: `translate(${size * 14 + 10}px, -50%)`,
                }}
              >
                {p.node.label}
              </div>
            </Html>
          </group>
        );
      })}

      <OrbitControls makeDefault enablePan />
    </>
  );
}

export default function Mindmap3D({
  root,
  width = 600,
  height = 500,
  onNodeClick,
  className,
  backgroundColor = tokens.colors.black_1,
  edgeColor = tokens.colors.grey_3,
}: Mindmap3DProps) {
  const placed = useMemo(() => layoutTree(root), [root]);

  return (
    <div
      className={classNames('sagtech-mindmap3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background: backgroundColor }}
    >
      <Canvas camera={{ position: [0, 4, 8], fov: 55 }} style={{ background: backgroundColor }}>
        <MindmapScene placed={placed} onNodeClick={onNodeClick} edgeColor={edgeColor} />
      </Canvas>
    </div>
  );
}
