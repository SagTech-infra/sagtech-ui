'use client';
import { GaugeChart } from '@sagtech-infra/ui/charts';

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <GaugeChart
        value={65}
        label="CPU"
        thresholds={[
          { value: 40, color: '#58A61B' },
          { value: 75, color: '#C6A328' },
          { value: 100, color: '#992D2D' },
        ]}
      />
    </div>
  );
}
