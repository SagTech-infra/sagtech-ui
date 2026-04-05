export type VariantType =
  | 'area'
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'candlestick'
  | 'boxPlot'
  | 'radar'
  | 'polarArea'
  | 'rangeBar'
  | 'rangeArea'
  | 'treemap'
  | undefined;

export type LineChartSeriesType = {
  name: string;
  data?: Array<{
    x: string;
    y: number;
  }>;
};
