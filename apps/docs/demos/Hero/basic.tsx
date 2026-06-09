'use client';

import { Hero, Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full rounded-16px overflow-hidden bg-black_1">
      <Hero
        eyebrow="SagTech UI"
        title="Ship faster"
        subtitle="A dark-first React component library."
        actions={<Button variant="primary">Get started</Button>}
      />
    </div>
  );
}
