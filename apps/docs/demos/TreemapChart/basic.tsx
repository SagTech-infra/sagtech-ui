'use client';
import { TreemapChart } from '@sagtech-infra/ui/charts';

const data = [
  { id: 'a', label: 'Engineering', value: 420 },
  { id: 'b', label: 'Sales', value: 310 },
  { id: 'c', label: 'Design', value: 180 },
  { id: 'd', label: 'Marketing', value: 150 },
  { id: 'e', label: 'Operations', value: 120 },
  { id: 'f', label: 'Support', value: 90 },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[600px]">
      <TreemapChart data={data} width="100%" height={400} />
    </div>
  );
}
