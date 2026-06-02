'use client';
import { useState } from 'react';
import { SelectInput } from '@sagtech-infra/ui';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
];

export default function Demo() {
  const [value, setValue] = useState('');
  return (
    <div className="w-full max-w-[480px]">
      <SelectInput
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Select a framework"
      />
    </div>
  );
}
