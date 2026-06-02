'use client';
import { useState } from 'react';
import { PhoneInput } from '@sagtech-infra/ui';

export default function Demo() {
  const [value, setValue] = useState('');
  return (
    <div className="w-full max-w-[480px]">
      <PhoneInput
        value={value}
        onChange={setValue}
        label="Phone number"
        name="phone"
      />
    </div>
  );
}
