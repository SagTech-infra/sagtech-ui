export interface MindmapNode {
  id: string;
  label: string;
  color?: string;
  children?: MindmapNode[];
}

export interface Mindmap3DProps {
  root: MindmapNode;
  width?: number;
  height?: number;
  onNodeClick?: (node: MindmapNode) => void;
  className?: string;
  /** Background CSS color. Defaults to tokens.colors.black_1. */
  backgroundColor?: string;
  /** Edge color override. */
  edgeColor?: string;
}
