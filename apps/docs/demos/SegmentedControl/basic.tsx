'use client';
import { useState } from 'react';
import { SegmentedControl } from '@sagtech-infra/ui';

export default function Demo() {
  const [value, setValue] = useState('week');

  return (
    <SegmentedControl
      value={value}
      onChange={setValue}
      options={[
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' },
      ]}
    />
  );
}
