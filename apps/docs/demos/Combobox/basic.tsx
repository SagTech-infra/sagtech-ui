'use client';
import { useState } from 'react';
import { Combobox } from '@sagtech-infra/ui';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Remix', value: 'remix' },
];

export default function Demo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-full max-w-[480px]">
      <Combobox
        label="Framework"
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Pick a framework"
      />
    </div>
  );
}
