'use client';
import { useState } from 'react';
import { Toggle } from '@sagtech-infra/ui';

export default function Demo() {
  const [sm, setSm] = useState(true);
  const [md, setMd] = useState(false);
  return (
    <div className="flex flex-col gap-16px">
      <Toggle size="sm" checked={sm} onChange={setSm} label="Small" />
      <Toggle size="md" checked={md} onChange={setMd} label="Enable notifications" />
      <Toggle checked={false} disabled label="Disabled" />
    </div>
  );
}
