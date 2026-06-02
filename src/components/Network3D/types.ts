import type { ReactNode } from 'react';

export interface Network3DNode {
  id: string;
  label?: string;
  color?: string;
  group?: string | number;
  /** Optional metadata pass-through. */
  [key: string]: unknown;
}

export interface Network3DLink {
  source: string;
  target: string;
  value?: number;
  /** Optional metadata pass-through. */
  [key: string]: unknown;
}

export interface Network3DProps {
  nodes: Network3DNode[];
  links: Network3DLink[];
  width?: number;
  height?: number;
  /** Per-node color override. Falls back to node.color, then default token. */
  nodeColor?: (node: Network3DNode) => string;
  /** Per-link color override. Falls back to default token. */
  linkColor?: (link: Network3DLink) => string;
  /** Allow click+drag of nodes. Defaults to true. */
  enableNodeDrag?: boolean;
  onNodeClick?: (node: Network3DNode) => void;
  /** Canvas background color. Defaults to tokens.colors.black_1. */
  backgroundColor?: string;
  className?: string;
  /**
   * Rendered inside the sized container while the 3D engine chunk loads (and
   * during SSR). Defaults to `null`.
   */
  loadingFallback?: ReactNode;
}
