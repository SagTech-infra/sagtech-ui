export type AreaChartSeries = {
  name: string;
  data: Array<{
    x: string;
    y: number;
  }>;
};

export interface AreaChartProps {
  series: AreaChartSeries[];
  width?: number | string;
  height?: number;
  /** Stack series so that each series is drawn on top of the previous total. */
  stacked?: boolean;
  /** Apply a fading gradient under the area stroke. Defaults to true. */
  gradient?: boolean;
}
