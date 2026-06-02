'use client';
import { HeatmapChart } from '@sagtech-infra/ui/charts';

const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const yLabels = ['Morning', 'Noon', 'Evening', 'Night'];

const data = yLabels.flatMap((y, yi) =>
  xLabels.map((x, xi) => ({ x, y, value: ((xi * 13 + yi * 29) % 100) + 1 })),
);

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <HeatmapChart data={data} xLabels={xLabels} yLabels={yLabels} width="100%" height={300} />
    </div>
  );
}
