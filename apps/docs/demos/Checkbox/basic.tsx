'use client';
import { useState } from 'react';
import { Checkbox } from '@sagtech-infra/ui';

export default function Demo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col items-start gap-16px">
      <Checkbox
        type="checkbox"
        label="I agree to the terms and conditions"
        checked={checked}
        onChange={() => setChecked((v) => !v)}
      />
      <Checkbox type="checkbox" label="Pre-checked option" checked />
    </div>
  );
}
