'use client';
import { NumberTicker } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-32px">
      <span className="font-orbitron text-48 text-white_4">
        <NumberTicker value={12345} />
      </span>
      <span className="font-manrope text-32 text-success">
        <NumberTicker
          value={9999.99}
          from={0}
          duration={2000}
          formatter={(n) =>
            n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          }
        />
      </span>
    </div>
  );
}
