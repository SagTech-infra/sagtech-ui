export type TreemapNode = {
  id: string;
  label: string;
  value: number;
  color?: string;
  children?: TreemapNode[];
};

export interface TreemapChartProps {
  data: TreemapNode[];
  width?: number | string;
  height?: number;
  /** Inner gap between rectangles in px. Defaults to 2. */
  padding?: number;
}
