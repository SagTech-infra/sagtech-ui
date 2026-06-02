'use client';
import { useState } from 'react';
import { RadioGroup } from '@sagtech-infra/ui';

const options = [
  { label: 'Starter', value: 'starter', description: 'Best for personal projects' },
  { label: 'Pro', value: 'pro', description: 'For growing teams and businesses' },
  { label: 'Enterprise', value: 'enterprise', description: 'Custom solutions and SLA' },
];

export default function Demo() {
  const [value, setValue] = useState('pro');
  return (
    <div className="w-full max-w-[480px]">
      <RadioGroup
        name="plan"
        options={options}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
