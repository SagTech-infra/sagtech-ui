'use client';
import { useState } from 'react';
import { Switch } from '@sagtech-infra/ui';

export default function Demo() {
  const [wifi, setWifi] = useState(true);
  const [airplane, setAirplane] = useState(false);
  return (
    <div className="flex flex-col gap-16px w-full max-w-[480px]">
      <Switch
        checked={wifi}
        onChange={setWifi}
        label="Wi-Fi"
        description="Connect automatically to known networks"
      />
      <Switch
        checked={airplane}
        onChange={setAirplane}
        label="Airplane mode"
        labelPosition="left"
      />
    </div>
  );
}
