'use client';
import { SparklineChart } from '@sagtech-infra/ui/charts';

const data = [12, 18, 8, 22, 16, 24, 28, 21, 30, 26, 34, 32];

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-24px text-white_1">
      <span className="flex items-center gap-8px">
        Revenue <SparklineChart data={data} tone="success" showArea /> +12%
      </span>
      <span className="flex items-center gap-8px">
        Errors <SparklineChart data={[2, 1, 3, 2, 4, 5, 6]} tone="error" /> +250%
      </span>
    </div>
  );
}
