'use client';

import { AuroraHero, Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full rounded-16px overflow-hidden bg-bg-primary">
      <AuroraHero
        eyebrow="Now in public beta"
        title="Launch your product at light speed"
        subtitle="A dark-first React + Tailwind component library engineered for sci-fi grade interfaces."
        actions={
          <>
            <Button variant="primary" text="Start building" />
            <Button variant="secondary" text="View docs" />
          </>
        }
        stats={[
          { value: '107+', label: 'Components' },
          { value: '749', label: 'Tests' },
          { value: '12', label: 'Charts' },
        ]}
      />
    </div>
  );
}
