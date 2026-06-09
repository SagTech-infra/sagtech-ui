'use client';
import { useState } from 'react';
import { TimePicker, type TimeValue } from '@sagtech-infra/ui';

// TimePicker is a footer-row control (a top divider separates it from the
// content above), so show it inside a settings-style card where the dividers
// read as intentional section rows.
export default function Demo() {
  const [start, setStart] = useState<TimeValue>({ hours: 9, minutes: 30 });
  const [end, setEnd] = useState<TimeValue>({ hours: 17, minutes: 0 });

  return (
    <div className="w-full max-w-[360px] rounded-16px border border-border-default bg-bg-secondary p-20px">
      <p className="font-orbitron text-16 text-fg-primary">Working hours</p>
      <p className="mt-4px text-13 text-fg-muted">Set the start and end of the day.</p>
      <TimePicker label="Start" value={start} onChange={setStart} />
      <TimePicker label="End" value={end} onChange={setEnd} />
    </div>
  );
}
