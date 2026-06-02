'use client';
import { Breadcrumbs } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <Breadcrumbs
      items={[
        { label: 'Home', href: '#' },
        { label: 'Projects', href: '#' },
        { label: 'Dashboard' },
      ]}
    />
  );
}
