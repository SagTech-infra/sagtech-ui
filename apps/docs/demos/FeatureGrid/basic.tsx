'use client';

import { FeatureGrid } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <FeatureGrid
      columns={3}
      items={[
        { title: 'Dark-first', description: 'Tokenized theme.' },
        { title: 'Charts & 3D', description: 'Canvas + WebGL.' },
        { title: 'Accessible', description: 'WAI-ARIA + jest-axe.' },
      ]}
    />
  );
}
