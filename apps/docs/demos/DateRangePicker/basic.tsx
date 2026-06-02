'use client';
import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@sagtech-infra/ui';

export default function Demo() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <div className="w-full max-w-[360px]">
      <DateRangePicker label="Pick a range" value={range} onChange={setRange} />
    </div>
  );
}
