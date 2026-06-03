'use client';

import { StatGrid } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <StatGrid
      items={[
        { value: 107, label: 'Components' },
        { value: 749, label: 'Tests' },
        { value: 12, label: 'Charts' },
        { value: 4, label: '3D' },
      ]}
    />
  );
}
