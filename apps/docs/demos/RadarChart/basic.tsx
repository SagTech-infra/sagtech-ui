'use client';
import { RadarChart } from '@sagtech-infra/ui/charts';

const axes = ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Looks'];

const series = [
  { name: 'Model A', values: [80, 70, 85, 90, 60, 75] },
  { name: 'Model B', values: [60, 90, 70, 75, 85, 65] },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <RadarChart series={series} axes={axes} width="100%" height={360} />
    </div>
  );
}
