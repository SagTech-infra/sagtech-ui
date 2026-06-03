'use client';

import { CTASection, Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <CTASection
      title="Build on it"
      subtitle="Install from GitHub Packages and compose."
      actions={<Button variant="secondary">Get started</Button>}
    />
  );
}
