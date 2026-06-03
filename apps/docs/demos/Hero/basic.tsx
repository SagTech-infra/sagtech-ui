'use client';

import { Hero, Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <Hero
      eyebrow="SagTech UI"
      title="Ship faster"
      subtitle="A dark-first React component library."
      actions={<Button variant="primary">Get started</Button>}
    />
  );
}
