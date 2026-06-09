'use client';

import { PricingTable } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <PricingTable
      plans={[
        {
          name: 'Starter',
          price: '$0',
          period: '/mo',
          tagline: 'For side projects and prototypes.',
          features: ['Up to 3 projects', 'Community support', 'Core components'],
        },
        {
          name: 'Pro',
          price: '$29',
          period: '/mo',
          yearlyPrice: '$290',
          tagline: 'For growing product teams.',
          features: ['Unlimited projects', 'Priority support', 'Advanced charts', 'Theme tokens'],
          featured: true,
          badge: 'Most popular',
          cta: 'Start free trial',
        },
        {
          name: 'Enterprise',
          price: '$99',
          period: '/mo',
          yearlyPrice: '$990',
          tagline: 'For organizations at scale.',
          features: ['SAML SSO', 'Dedicated support', 'Audit logs', 'Custom SLAs'],
          cta: 'Contact sales',
        },
      ]}
      onSelect={(plan) => console.log('selected', plan.name)}
    />
  );
}
