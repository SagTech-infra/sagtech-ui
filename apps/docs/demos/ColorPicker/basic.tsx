'use client';
import { useState } from 'react';
import { ColorPicker } from '@sagtech-infra/ui';

export default function Demo() {
  const [brand, setBrand] = useState('#3B82F6');
  const [overlay, setOverlay] = useState('#8B5CF6CC');
  return (
    <div className="flex flex-col gap-16px w-full max-w-[480px]">
      <ColorPicker label="Brand color" value={brand} onChange={setBrand} />
      <ColorPicker label="Overlay color" alpha value={overlay} onChange={setOverlay} />
    </div>
  );
}
