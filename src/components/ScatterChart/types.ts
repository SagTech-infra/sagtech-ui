export type ScatterPoint = {
  x: number;
  y: number;
  /** Optional bubble radius in px. Defaults to 5. */
  size?: number;
};

export type ScatterChartSeries = {
  name: string;
  points: ScatterPoint[];
};

export interface ScatterChartProps {
  series: ScatterChartSeries[];
  width?: number | string;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}
