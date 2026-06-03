'use client';

import { useState } from 'react';
import {
  Hero,
  SegmentedControl,
  CardWrapper,
  Container,
  Badge,
  Button,
  StatGrid,
  Accordion,
  AccordionItem,
} from '@sagtech-infra/ui';

type Billing = 'monthly' | 'yearly';

interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    tagline: 'For side projects and prototypes.',
    monthly: 0,
    yearly: 0,
    features: ['1 project', 'Community support', 'Core components', '1 GB storage'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    tagline: 'For teams shipping to production.',
    monthly: 29,
    yearly: 24,
    features: [
      'Unlimited projects',
      'Priority support',
      'All components + charts',
      '100 GB storage',
      'Team roles & SSO',
    ],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For organizations at scale.',
    monthly: 99,
    yearly: 82,
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-[2px] h-[18px] w-[18px] flex-shrink-0 text-success"
    >
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === 'monthly' ? plan.monthly : plan.yearly;
  return (
    <CardWrapper
      rounded="24"
      stoke="2"
      className={plan.highlighted ? 'bg-surface-wash border-pr_purple' : ''}
    >
      <div className="flex h-full flex-col gap-24px p-32px">
        <div className="flex flex-col gap-8px">
          <div className="flex items-center justify-between gap-12px">
            <h3 className="font-orbitron text-28 text-fg-primary">{plan.name}</h3>
            {plan.highlighted && (
              <Badge variant="filled" color="purple" size="sm">
                Most popular
              </Badge>
            )}
          </div>
          <p className="font-manrope text-14 text-fg-muted">{plan.tagline}</p>
        </div>

        <div className="flex items-end gap-8px">
          <span className="font-orbitron text-48 text-fg-primary">${price}</span>
          <span className="mb-12px font-manrope text-14 text-fg-secondary">
            / mo{billing === 'yearly' ? ', billed yearly' : ''}
          </span>
        </div>

        <ul className="flex flex-col gap-12px">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-8px font-manrope text-14 text-fg-secondary">
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8px">
          <Button
            text={plan.cta}
            variant={plan.highlighted ? 'primary' : 'secondary'}
            buttonSize="large"
            classes="w-full justify-center"
            onClick={() => {}}
          />
        </div>
      </div>
    </CardWrapper>
  );
}

export default function PricingTemplate() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <div className="min-h-screen bg-bg-primary">
      <Hero
        eyebrow="Pricing"
        title="Pricing that scales with you"
        subtitle="Start free, then pay only for what your team actually ships. No hidden seats, no surprise overages."
        background="glow"
        align="center"
      />

      <Container size="lg" className="pb-64px">
        <div className="flex flex-col items-center gap-12px">
          <SegmentedControl
            size="lg"
            value={billing}
            onChange={(next) => setBilling(next as Billing)}
            aria-label="Billing period"
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
          />
          <Badge variant="subtle" color="success" size="sm">
            Save ~17% on yearly
          </Badge>
        </div>

        <div className="mt-48px grid grid-cols-1 gap-24px lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} billing={billing} />
          ))}
        </div>

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
