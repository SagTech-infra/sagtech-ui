'use client';
import { ResultPill } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-24px">
      <ResultPill title="150+" info="Projects Delivered" />
      <ResultPill title="50+" info="Team Members" />
      <ResultPill title="99.9%" info="Uptime Guarantee" />
    </div>
  );
}
