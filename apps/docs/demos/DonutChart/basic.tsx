'use client';
import { DonutChart } from '@sagtech-infra/ui/charts';

const colors = [
  { bgColor: '#6D3EF1', color: '#FFFFFF' },
  { bgColor: '#9271EE', color: '#FFFFFF' },
  { bgColor: '#CBBCF8', color: '#000000' },
  { bgColor: '#4A2AAF', color: '#FFFFFF' },
  { bgColor: '#E0D6FC', color: '#000000' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <DonutChart
        value={[35, 25, 20, 12, 8]}
        colors={colors}
        labels={['React', 'Node.js', 'Python', 'Go', 'Other']}
        size={65}
        width={300}
      />
    </div>
  );
}
