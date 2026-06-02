'use client';
import { BarChart } from '@sagtech-infra/ui/charts';

const series = [
  {
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 30 },
      { x: 'Feb', y: 40 },
      { x: 'Mar', y: 35 },
      { x: 'Apr', y: 50 },
      { x: 'May', y: 49 },
      { x: 'Jun', y: 60 },
    ],
  },
  {
    name: 'Expenses',
    data: [
      { x: 'Jan', y: 20 },
      { x: 'Feb', y: 25 },
      { x: 'Mar', y: 22 },
      { x: 'Apr', y: 30 },
      { x: 'May', y: 28 },
      { x: 'Jun', y: 35 },
    ],
  },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <BarChart series={series} grouped width="100%" height={320} />
    </div>
  );
}
