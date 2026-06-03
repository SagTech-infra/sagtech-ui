'use client';

import {
  Hero,
  FeatureGrid,
  StatGrid,
  CTASection,
  AvatarCard,
  Rate,
  Container,
  CardWrapper,
  Badge,
  Button,
} from '@sagtech-infra/ui';

const TRUST_LOGOS = ['Northwind', 'Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli'];

const FEATURES = [
  {
    title: 'Dark-first design tokens',
    description:
      'Every color, radius and spacing step ships from a single Tailwind theme so your product stays consistent without a style guide PDF.',
  },
  {
    title: 'Tree-shakeable bundle',
    description:
      'ESM + CJS builds with externalized peers. You ship only the components you import, never a megabyte of unused widgets.',
  },
  {
    title: 'Framework agnostic',
    description:
      'Drop it into Next.js, Remix or plain Vite. Inject your own image and link components — no hard dependency on a router.',
  },
  {
    title: 'Accessible by default',
    description:
      'Focus rings, ARIA roles and keyboard paths come baked in. Ship WCAG-friendly UI without auditing every button by hand.',
  },
  {
    title: 'Composable primitives',
    description:
      'Compound components for forms, tables and toasts give you the building blocks instead of opinionated black boxes.',
  },
  {
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
    info: 'Head of Design, Northwind',
    initial: 'S',
    rating: 5,
    quote:
      'We replaced three internal UI repos with SagTech UI and cut our design-to-ship time roughly in half. The tokens just work.',
  },
  {
    name: 'Daniel Reyes',
    info: 'Staff Engineer, Globex',
    initial: 'D',
    rating: 5,
    quote:
      'The framework-agnostic provider meant zero rewiring when we moved off Next. Best migration story I have had in years.',
  },
  {
    name: 'Mei Lin',
    info: 'Product Lead, Initech',
    initial: 'M',
    rating: 4,
    quote:
      'Accessibility was the selling point for us. Keyboard and screen-reader support is there out of the box, not bolted on later.',
  },
];

export default function LandingTemplate() {
  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary">
      {/* Hero */}
      <Hero
        background="gradient"
        align="center"
        eyebrow="SagTech UI v2.2"
        title="The dark-first component library your product deserves"
        subtitle="Ship polished, accessible interfaces faster. One typed package, every primitive you need, zero design debt."
        actions={
          <>
            <Button text="Start building" variant="primary" buttonSize="large" />
            <Button text="View components" variant="secondary" buttonSize="large" />
          </>
        }
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
            <CardWrapper key={t.name} rounded="24" stoke="2" className="p-24px">
              <div className="flex h-full flex-col gap-16px">
                <Rate value={t.rating} max={5} size={18} label={t.name} />
                <p className="flex-1 text-16 leading-24 text-fg-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-12px border-t border-border-default pt-16px">
                  <span className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-pr_purple font-orbitron text-18 text-white_1">
                    {t.initial}
                  </span>
                  <div>
                    <p className="text-14 text-fg-primary">{t.name}</p>
                    <p className="text-12 text-fg-muted">{t.info}</p>
                  </div>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>

        {/* Featured author spotlight via AvatarCard */}
        <div className="mt-48px flex flex-wrap items-center justify-center gap-32px">
          <AvatarCard name="Sofia Marenko" info="Head of Design, Northwind">
            <div className="flex h-full w-full items-center justify-center bg-pr_purple text-[48px] text-white_1">
              S
            </div>
          </AvatarCard>
          <AvatarCard name="Daniel Reyes" info="Staff Engineer, Globex">
            <div className="flex h-full w-full items-center justify-center bg-sec_purple text-[48px] text-white_1">
              D
            </div>
          </AvatarCard>
        </div>
      </Container>

      {/* CTA */}
      <Container size="lg" as="section" className="py-64px">
        <CTASection
          title="Start shipping today"
          subtitle="Install from GitHub Packages, import a component, and watch your roadmap move faster."
          actions={
            <>
              <Button text="Get the package" variant="primary" buttonSize="large" />
              <Button text="Read the docs" variant="secondary" buttonSize="large" />
            </>
          }
        />
      </Container>
    </div>
  );
}
