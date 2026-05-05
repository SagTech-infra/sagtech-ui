export type BarChartSeries = {
  name: string;
  data: Array<{
    x: string;
    y: number;
  }>;
};

export interface BarChartProps {
  series: BarChartSeries[];
  width?: number | string;
  height?: number;
  /** Vertical (default) draws columns; horizontal draws bars left-to-right. */
  orientation?: 'vertical' | 'horizontal';
  /** Stack series so totals share a single column/bar per category. */
  stacked?: boolean;
  /**
   * Group series side-by-side per category. Mutually exclusive with `stacked`
   * — `stacked` wins if both are true.
   */
  grouped?: boolean;
}
