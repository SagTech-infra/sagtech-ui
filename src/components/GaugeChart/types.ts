export type GaugeThreshold = {
  value: number;
  color: string;
};

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  /** Coloured zones along the arc. Each threshold colors the band ending at `value`. */
  thresholds?: GaugeThreshold[];
  label?: string;
  width?: number;
  height?: number;
  /** Render the numeric value in the centre. Defaults to true. */
  showValue?: boolean;
}
