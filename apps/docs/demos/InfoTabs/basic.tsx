'use client';
import { InfoTabs } from '@sagtech-infra/ui';

const tabs = [
  {
    title: 'Features',
    description:
      'Everything you need in one place — composable components, sensible defaults, and full type safety out of the box.',
    buttonText: 'Explore',
    role: 'features',
  },
  {
    title: 'Pricing',
    description:
      'Simple, transparent plans that scale with your team. Start free and upgrade whenever you need more.',
    buttonText: 'View Plans',
    role: 'pricing',
  },
  {
    title: 'Support',
    description:
      'Friendly help when you need it, with detailed docs, examples, and a responsive community.',
    role: 'support',
  },
];

export default function Demo() {
  return <InfoTabs title="Overview" list={tabs} />;
}
