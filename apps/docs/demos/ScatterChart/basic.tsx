'use client';
import { ScatterChart } from '@sagtech-infra/ui/charts';

const series = [
  {
    name: 'Group A',
    points: [
      { x: 12, y: 28 }, { x: 25, y: 40 }, { x: 38, y: 22 }, { x: 50, y: 55 },
      { x: 63, y: 48 }, { x: 71, y: 70 }, { x: 84, y: 60 }, { x: 92, y: 80 },
    ],
  },
  {
    name: 'Group B',
    points: [
      { x: 18, y: 60, size: 8 }, { x: 30, y: 35, size: 6 }, { x: 44, y: 72, size: 10 },
      { x: 58, y: 30, size: 5 }, { x: 70, y: 50, size: 7 }, { x: 88, y: 42, size: 9 },
    ],
  },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <ScatterChart series={series} width="100%" height={360} xLabel="Engagement" yLabel="Conversion" />
    </div>
  );
}
