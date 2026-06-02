'use client';
import { useState } from 'react';
import { Slider } from '@sagtech-infra/ui';

export default function Demo() {
  const [volume, setVolume] = useState(40);
  const [price, setPrice] = useState<[number, number]>([25, 75]);
  return (
    <div className="flex flex-col gap-24px w-full max-w-[480px]">
      <Slider min={0} max={100} step={1} label="Volume" value={volume} onChange={setVolume} />
      <Slider
        range
        min={0}
        max={100}
        step={1}
        label="Price range"
        value={price}
        onChange={setPrice}
      />
    </div>
  );
}
