export type RadarChartSeries = {
  name: string;
  values: number[];
};

export interface RadarChartProps {
  series: RadarChartSeries[];
  axes: string[];
  width?: number | string;
  height?: number;
  /** Concentric grid rings + axis spokes. Defaults to true. */
  showGrid?: boolean;
  /** Polygon fill alpha 0..1. Defaults to 0.3. */
  fill?: number;
}
