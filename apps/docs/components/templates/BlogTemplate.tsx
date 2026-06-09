'use client';

import { Container, Badge, Avatar, CardWrapper, CodeBlock, Divider } from '@sagtech-infra/ui';

const TAGS = ['Design systems', 'Tailwind', 'TypeScript', 'Dark mode'];

const RELATED = [
  {
    category: 'Engineering',
    title: 'Tree-shaking a component library the right way',
    minutes: 6,
  },
  {
    category: 'Design',
    title: 'Designing tokens that survive a redesign',
    minutes: 8,
  },
  {
    category: 'Product',
    title: 'Shipping accessible UI without slowing down',
    minutes: 5,
  },
];

const SNIPPET = `import { AuroraHero, PricingTable } from '@sagtech_llc/ui';

export function Pricing() {
  return (
    <>
      <AuroraHero
        eyebrow="Pricing"
        title="Pricing that scales with you"
      />
      <PricingTable plans={plans} />
    </>
  );
}`;

export default function BlogTemplate() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Container size="md" className="py-64px">
        <article className="mx-auto max-w-[720px]">
          {/* Header */}
          <header className="flex flex-col gap-16px">
            <Badge variant="subtle" color="purple" size="md">
              Engineering
            </Badge>
            <h1 className="font-orbitron text-40 leading-[1.1] text-fg-primary sm:text-[48px]">
              Building a dark-first design system that scales
            </h1>
            <p className="text-18 leading-28 text-fg-secondary">
              How we shipped 120+ typed components from a single Tailwind theme — and why dark mode
              came first, not last.
            </p>

            <div className="mt-8px flex items-center gap-12px">
              <Avatar name="Sofia Marenko" size="md" />
              <div className="flex flex-col">
                <span className="font-manrope text-14 text-fg-primary">Sofia Marenko</span>
                <span className="font-manrope text-12 text-fg-muted">
                  June 8, 2026 · 7 min read
                </span>
              </div>
            </div>
          </header>

          <div className="my-32px overflow-hidden rounded-24px border border-border-default bg-surface-wash">
            <div className="flex h-[280px] items-center justify-center">
              <span className="font-orbitron text-28 text-fg-muted">Cover image</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-24px text-16 leading-28 text-fg-secondary">
            <p>
              Most component libraries treat dark mode as an afterthought — a second theme bolted on
              once the light palette already shipped. We took the opposite bet. By making the dark
              palette the source of truth, every color, radius and spacing step flows from a single
              Tailwind <code className="rounded-6px bg-bg-tertiary px-6px py-2px font-mono text-14 text-sec_purple">@theme</code>{' '}
              block, and nothing drifts.
            </p>
            <p>
              That decision rippled through everything: contrast ratios, focus rings, even the way we
              name tokens. Below is the result — a hero and pricing grid composed from two
              primitives, with zero bespoke styling.
            </p>

            <h2 className="mt-16px font-orbitron text-28 text-fg-primary">Composition over configuration</h2>
            <p>
              Instead of a hundred props, we lean on composition. Drop in a primitive, pass it data,
              and the theme does the rest. Here is the entire pricing page:
            </p>

            <CodeBlock code={SNIPPET} language="tsx" filename="pricing.tsx" showLineNumbers />

            <blockquote className="border-l-2 border-pr_purple bg-surface-wash px-24px py-16px font-manrope text-18 italic leading-28 text-fg-primary">
              “The best design system is the one your team forgets they are using — it just feels
              like the product.”
            </blockquote>

            <p>
              The payoff is consistency without policing. New screens inherit the palette for free,
              and a single token change updates the whole surface area in one commit.
            </p>
          </div>

          {/* Tags */}
          <Divider variant="solid" className="my-32px" />
          <div className="flex flex-wrap items-center gap-8px">
            <span className="font-manrope text-14 text-fg-muted">Tagged:</span>
            {TAGS.map((tag) => (
              <Badge key={tag} variant="outlined" color="grey" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </article>
      </Container>

      {/* Related */}
      <Container size="lg" as="section" className="pb-64px">
        <h2 className="mb-24px font-orbitron text-28 text-fg-primary">Related articles</h2>
        <div className="grid grid-cols-1 gap-24px sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((post) => (
            <CardWrapper key={post.title} rounded="24" stoke="2" className="p-24px">
              <div className="flex h-full flex-col gap-12px">
                <Badge variant="subtle" color="blue" size="sm">
                  {post.category}
                </Badge>
                <h3 className="flex-1 font-orbitron text-18 leading-24 text-fg-primary">
                  {post.title}
                </h3>
                <span className="font-manrope text-12 text-fg-muted">{post.minutes} min read</span>
              </div>
            </CardWrapper>
          ))}
        </div>
      </Container>
    </div>
  );
}
