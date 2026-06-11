'use client';

import type { ReactNode } from 'react';
import {
  AuroraHero,
  FeatureGrid,
  StatGrid,
  CTASection,
  Rate,
  Container,
  CardWrapper,
  Badge,
  Button,
} from '@sagtech-infra/ui';

const TRUST_LOGOS = ['Northwind', 'Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli'];

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-12px bg-surface-wash text-sec_purple">
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

const FEATURES = [
  {
    icon: (
      <Icon>
        <path
          d="M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    ),
    title: 'Dark-first design tokens',
    description:
      'Every color, radius and spacing step ships from a single Tailwind theme so your product stays consistent without a style guide PDF.',
  },
  {
    icon: (
      <Icon>
        <path
          d="M12 3v18M3 12h18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      </Icon>
    ),
    title: 'Tree-shakeable bundle',
    description:
      'ESM + CJS builds with externalized peers. You ship only the components you import, never a megabyte of unused widgets.',
  },
  {
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 20h8M12 18v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </Icon>
    ),
    title: 'Framework agnostic',
    description:
      'Drop it into Next.js, Remix or plain Vite. Inject your own image and link components — no hard dependency on a router.',
  },
  {
    icon: (
      <Icon>
        <path
          d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    ),
    title: 'Accessible by default',
    description:
      'Focus rings, ARIA roles and keyboard paths come baked in. Ship WCAG-friendly UI without auditing every button by hand.',
  },
  {
    icon: (
      <Icon>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      </Icon>
    ),
    title: 'Composable primitives',
    description:
      'Compound components for forms, tables and toasts give you the building blocks instead of opinionated black boxes.',
  },
  {
    icon: (
      <Icon>
        <path
          d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    ),
    title: 'Typed end to end',
    description:
      'Generated .d.ts files mean autocomplete on every prop and a build that breaks the moment an API drifts.',
  },
];

const STATS = [
  { value: 120, label: 'Components', suffix: '+' },
  { value: 6, label: 'Bundle size', suffix: 'kb' },
  { value: 99, label: 'Type coverage', suffix: '%' },
  { value: 4200, label: 'Teams shipping' },
];

const TESTIMONIALS = [
  {
    name: 'Sofia Marenko',
    role: 'Head of Design',
    company: 'Northwind',
    initial: 'S',
    rating: 5,
    quote:
      'We replaced three internal UI repos with SagTech UI and cut our design-to-ship time roughly in half. The tokens just work.',
  },
  {
    name: 'Daniel Reyes',
    role: 'Staff Engineer',
    company: 'Globex',
    initial: 'D',
    rating: 5,
    quote:
      'The framework-agnostic provider meant zero rewiring when we moved off Next. Best migration story I have had in years.',
  },
  {
    name: 'Mei Lin',
    role: 'Product Lead',
    company: 'Initech',
    initial: 'M',
    rating: 4,
    quote:
      'Accessibility was the selling point for us. Keyboard and screen-reader support is there out of the box, not bolted on later.',
  },
];

export default function LandingTemplate() {
  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary">
      <AuroraHero
        eyebrow="SagTech UI v2.2"
        title="The dark-first component library your product deserves"
        subtitle="Ship polished, accessible interfaces faster. One typed package, every primitive you need, zero design debt."
        actions={
          <>
            <Button text="Start building" variant="primary" buttonSize="large" />
            <Button text="View components" variant="secondary" buttonSize="large" />
          </>
        }
        stats={[
          { value: '120+', label: 'Components' },
          { value: '4,200', label: 'Teams shipping' },
          { value: '6kb', label: 'Core bundle' },
          { value: '99%', label: 'Type coverage' },
        ]}
      />

      {/* Trust strip */}
      <Container size="lg" as="section" className="py-48px">
        <p className="text-center text-12 uppercase tracking-widest text-fg-muted">
          Trusted by product teams everywhere
        </p>
        <div className="mt-24px flex flex-wrap items-center justify-center gap-x-32px gap-y-16px">
          {TRUST_LOGOS.map((logo) => (
            <span
              key={logo}
              className="font-orbitron text-18 text-fg-secondary opacity-70 transition-opacity hover:opacity-100"
            >
              {logo}
            </span>
          ))}
        </div>
      </Container>

      {/* Features */}
      <Container size="lg" as="section" className="py-64px">
        <div className="mb-32px text-center">
          <Badge variant="subtle" color="purple" size="md">
            Why SagTech
          </Badge>
          <h2 className="mt-16px font-orbitron text-32 text-fg-primary sm:text-40">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mx-auto mt-12px max-w-[640px] text-16 text-fg-muted">
            A focused set of primitives built for teams who care about speed and craft in equal
            measure.
          </p>
        </div>
        <FeatureGrid items={FEATURES} columns={3} />
      </Container>

      {/* Stats */}
      <Container size="lg" as="section" className="py-64px">
        <StatGrid items={STATS} />
      </Container>

      {/* Testimonials */}
      <Container size="lg" as="section" className="py-64px">
        <div className="mb-32px text-center">
          <Badge variant="subtle" color="blue" size="md">
            Loved by builders
          </Badge>
          <h2 className="mt-16px font-orbitron text-32 text-fg-primary sm:text-40">
            Teams ship with confidence
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-24px sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <CardWrapper
              key={t.name}
              rounded="24"
              stoke="2"
              className="h-full p-24px transition-all hover:-translate-y-[2px] hover:border-border-strong hover:shadow-3xl"
            >
              <div className="flex h-full flex-col gap-16px">
                <Rate value={t.rating} max={5} size={18} label={t.name} />
                <p className="flex-1 text-16 leading-24 text-fg-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-12px border-t border-border-default pt-16px">
                  <span className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-pr_purple font-orbitron text-18 text-white">
                    {t.initial}
                  </span>
                  <div>
                    <p className="text-14 text-fg-primary">{t.name}</p>
                    <p className="text-12 text-fg-muted">
                      {t.role} · <span className="text-sec_purple">{t.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      </Container>

      {/* CTA */}
      <Container size="lg" as="section" className="py-64px">
        <CTASection
          title="Start shipping today"
          subtitle="Install from npm, import a component, and watch your roadmap move faster."
          actions={
            <>
              <Button
                text="Get the package"
                variant="secondary"
                buttonSize="large"
                classes="!bg-white !text-pr_purple !border-white hover:!opacity-90"
              />
              <Button
                text="Read the docs"
                variant="secondary"
                buttonSize="large"
                classes="!bg-transparent !text-white !border-white hover:!bg-white/10"
              />
            </>
          }
        />
      </Container>
    </div>
  );
}
