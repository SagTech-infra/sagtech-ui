'use client';

import {
  AuroraHero,
  PricingTable,
  Container,
  StatGrid,
  Accordion,
  AccordionItem,
  type PricingPlan,
} from '@sagtech-infra/ui';

const PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    yearlyPrice: '$0',
    tagline: 'For side projects and prototypes.',
    features: ['1 project', 'Community support', 'Core components', '1 GB storage'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    yearlyPrice: '$24',
    tagline: 'For teams shipping to production.',
    features: [
      'Unlimited projects',
      'Priority support',
      'All components + charts',
      '100 GB storage',
      'Team roles & SSO',
    ],
    cta: 'Start Pro trial',
    featured: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mo',
    yearlyPrice: '$82',
    tagline: 'For organizations at scale.',
    features: [
      'Everything in Pro',
      'Dedicated success manager',
      'Custom SLAs & audit logs',
      'Unlimited storage',
      'On-prem deployment',
    ],
    cta: 'Contact sales',
  },
];

const STATS = [
  { value: 12000, label: 'Active teams', suffix: '+' },
  { value: 99, label: 'Uptime', suffix: '.9%' },
  { value: 107, label: 'Components shipped' },
  { value: 4, label: 'Avg. setup', suffix: ' min' },
];

const FAQS = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade or downgrade at any time — changes are prorated to your billing cycle, no contract lock-in.',
  },
  {
    q: 'What does yearly billing save me?',
    a: 'Yearly billing is roughly 17% cheaper than paying month to month, billed once per year.',
  },
  {
    q: 'Is there a free tier?',
    a: 'The Starter plan is free forever for a single project, including the core component set.',
  },
  {
    q: 'How does support work?',
    a: 'Starter uses community channels. Pro and Enterprise get priority response times, with a dedicated manager on Enterprise.',
  },
];

export default function PricingTemplate() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <AuroraHero
        eyebrow="Pricing"
        title="Pricing that scales with you"
        subtitle="Start free, then pay only for what your team actually ships. No hidden seats, no surprise overages."
      />

      <Container size="lg" className="pb-64px">
        <PricingTable plans={PLANS} />

        <div className="mt-64px">
          <StatGrid items={STATS} />
        </div>

        <div className="mt-64px">
          <h2 className="mb-24px text-center font-orbitron text-32 text-fg-primary">
            Frequently asked questions
          </h2>
          <div className="mx-auto max-w-[820px]">
            <Accordion type="single" defaultValue={[FAQS[0].q]}>
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q} label={faq.q}>
                  {faq.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </div>
  );
}
