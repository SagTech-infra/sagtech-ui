'use client';
import { useState } from 'react';
import { DatePicker } from '@sagtech-infra/ui';

export default function Demo() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="w-full max-w-[340px]">
      <DatePicker
        label="Appointment date"
        placeholder="Select date"
        value={date}
        onChange={setDate}
      />
    </div>
  );
}
