export type FunnelStage = {
  label: string;
  value: number;
  color?: string;
};

export interface FunnelChartProps {
  stages: FunnelStage[];
  width?: number | string;
  height?: number;
  orientation?: 'vertical' | 'horizontal';
  /** Show conversion percentage between adjacent stages. Defaults to true. */
  showPercents?: boolean;
}
