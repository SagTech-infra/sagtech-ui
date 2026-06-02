'use client';
import { StatCard } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <StatCard label="Total Revenue" value="$48,520" change={{ value: 12.5, direction: 'up' }} />
      <StatCard label="Churn Rate" value="4.8%" change={{ value: 3.2, direction: 'down' }} />
    </div>
  );
}
