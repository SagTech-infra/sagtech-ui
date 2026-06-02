'use client';
import { useState } from 'react';
import { TimePicker, type TimeValue } from '@sagtech-infra/ui';

export default function Demo() {
  const [value, setValue] = useState<TimeValue>({ hours: 9, minutes: 30 });
  return (
    <div className="w-full max-w-[340px]">
      <TimePicker label="Start" value={value} onChange={setValue} />
    </div>
  );
}
