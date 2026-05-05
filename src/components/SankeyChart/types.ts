export type SankeyNode = {
  id: string;
  label: string;
};

export type SankeyLink = {
  source: string;
  target: string;
  value: number;
};

export interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number | string;
  height?: number;
}
