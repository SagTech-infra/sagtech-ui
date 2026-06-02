'use client';
import { FunnelChart } from '@sagtech-infra/ui/charts';

const stages = [
  { label: 'Visited', value: 1000 },
  { label: 'Sign-ups', value: 620 },
  { label: 'Activated', value: 380 },
  { label: 'Subscribed', value: 145 },
  { label: 'Renewed', value: 92 },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[500px]">
      <FunnelChart stages={stages} width="100%" height={400} showPercents />
    </div>
  );
}
