'use client';
import { useState } from 'react';
import { Calendar } from '@sagtech-infra/ui';

export default function Demo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div className="inline-block bg-black_1 border border-black_3 rounded-16px p-20px">
      <Calendar value={date} onChange={setDate} />
    </div>
  );
}
