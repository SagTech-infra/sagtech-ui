export type HeatmapDatum = {
  x: string | number;
  y: string | number;
  value: number;
};

export interface HeatmapChartProps {
  data: HeatmapDatum[];
  xLabels: string[];
  yLabels: string[];
  width?: number | string;
  height?: number;
  /** [from, to] CSS colors. Defaults to pr_purple → sec_purple. */
  colorScale?: [from: string, to: string];
}
