import type { ReactNode } from 'react';
import NextLink from 'next/link';
import {
  Container,
  Hero,
  StatGrid,
  FeatureGrid,
  CTASection,
  Accordion,
  AccordionItem,
} from '@sagtech-infra/ui';
import { LandingShowcase } from '@/components/LandingShowcase';
import { templates } from '@/content/templates';

const PACKAGES_URL = 'https://github.com/orgs/SagTech-infra/packages/npm/package/ui';
const REPO_URL = 'https://github.com/SagTech-infra/sagtech-ui';
const SAGTECH_URL = 'https://sagtech.io';

function LinkButton({
  href,
  children,
  variant = 'primary',
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  className?: string;
}) {
  const cls =
    'inline-flex items-center rounded-12px px-20px py-10px font-manrope text-14 transition-colors ' +
    (variant === 'primary'
      ? 'bg-pr_purple text-white hover:opacity-90'
      : 'border border-border-strong text-fg-primary hover:bg-bg-secondary') +
    (className ? ` ${className}` : '');
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <NextLink href={href} className={cls}>
      {children}
    </NextLink>
  );
}

const STATS = [
  { value: 107, label: 'Components' },
  { value: 12, label: 'Chart types' },
  { value: 4, label: '3D scenes' },
  { value: 2, label: 'Themes' },
];

const FEATURES = [
  {
    title: 'Dark by default',
    description: 'Sharp in dark mode out of the box — with a polished light theme when you need it.',
  },
  {
    title: 'Charts & 3D included',
    description: 'From simple line charts to interactive 3D globes — data visuals that just work.',
  },
  {
    title: 'Accessible by default',
    description: 'Keyboard and screen-reader support are built in, not bolted on later.',
  },
  {
    title: 'Only ship what you use',
    description: 'Import a button, ship a button. The heavy parts load only when you need them.',
  },
  {
    title: 'Fits your stack',
    description: 'Drop it into Next.js or any React app — server rendering included.',
  },
  {
    title: 'Proven in production',
    description: 'This whole site is built with it. We use what we ship.',
  },
];

const FAQ = [
  {
    q: 'How do I install it?',
    a: 'Published to GitHub Packages under the @sagtech-infra scope. Add a PAT with read:packages to your .npmrc, then `pnpm add @sagtech-infra/ui`.',
  },
  {
    q: 'How do I get the styles?',
    a: "Import the tokens once at the top of your global stylesheet: `@import '@sagtech-infra/ui/tokens';` — it ships the @theme block, gradients and animations.",
  },
  {
    q: 'Does it work without Next.js?',
    a: 'Yes. Alias next/image · next/link · next/dynamic to shims, or wrap your app in SagtechUIProvider and pass your own image/link components.',
  },
  {
    q: 'Are charts and 3D bundled in?',
    a: 'No — they are optional peer deps behind the /charts and /3d subpath exports. You only pay for what you import.',
  },
  {
    q: 'Is there a light theme?',
    a: 'Dark-first by design; light mode is fully supported via ThemeProvider (sets data-theme), with brand accents tuned for AA on light surfaces.',
  },
];

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-24px font-display text-32 text-fg-primary">{children}</h2>;
}

export default function HomePage() {
  return (
    <main>
      <Hero
        align="center"
        background="glow"
        eyebrow="SagTech UI"
        title="Components that ship as fast as you do"
        subtitle="107 polished React components — buttons, forms, charts, 3D — plus full-page templates ready to drop into your product. Dark by default, accessible by default."
        actions={
          <>
            <LinkButton href="/components/button">Browse components</LinkButton>
            <LinkButton href="/templates">Browse templates</LinkButton>
            <LinkButton href={PACKAGES_URL} variant="secondary" external>
              GitHub Packages
            </LinkButton>
          </>
        }
      />

      <Container size="lg" className="pb-72px">
        <section className="mt-8px">
          <StatGrid items={STATS} />
        </section>

        <section className="mt-72px">
          <SectionHeading>Built by SagTech</SectionHeading>
          <div className="rounded-24px border border-border-default bg-surface-wash p-32px">
            <p className="max-w-[760px] text-18 leading-28 text-fg-secondary">
              SagTech ships prototypes in 48 hours and production-ready code after — no fluff.
              We move that fast because we build on our own reusable foundations. This component
              library is one of them, now open for your products too.
            </p>
            <p className="mt-16px max-w-[760px] text-14 leading-24 text-fg-muted">
              No black box. Direct communication with the people building your product. Clean code
              you can actually own. And support that doesn&apos;t disappear after launch.
            </p>
            <LinkButton href={SAGTECH_URL} variant="secondary" external className="mt-24px">
              Learn more about SagTech →
            </LinkButton>
          </div>
        </section>

        <section className="mt-72px">
          <SectionHeading>Why this library</SectionHeading>
          <FeatureGrid items={FEATURES} columns={3} />
        </section>

        <section className="mt-72px">
          <SectionHeading>See it live</SectionHeading>
          <p className="mb-24px max-w-[640px] text-16 text-fg-muted">
            Real components, rendered right here — the same ones you import.
          </p>
          <LandingShowcase />
        </section>

        <section className="mt-72px">
          <SectionHeading>Start from a template</SectionHeading>
          <p className="mb-24px max-w-[640px] text-16 text-fg-muted">
            Full pages assembled entirely from these components — open one, flip to Code, and copy.
          </p>
          <div className="grid grid-cols-1 gap-16px sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <NextLink
                key={t.slug}
                href={`/templates/${t.slug}`}
                className="group flex flex-col rounded-24px border border-border-default bg-bg-secondary p-24px transition-all duration-200 hover:-translate-y-[2px] hover:border-border-strong"
              >
                <span className="font-display text-12 uppercase tracking-wider text-grey_2">
                  {t.kind}
                </span>
                <h3 className="mt-12px font-display text-18 text-fg-primary">{t.name}</h3>
                <p className="mt-8px text-14 text-fg-muted">{t.description}</p>
                <span className="mt-16px inline-flex items-center text-13 text-sec_purple opacity-0 transition-opacity group-hover:opacity-100">
                  Open template →
                </span>
              </NextLink>
            ))}
          </div>
          <NextLink
            href="/templates"
            className="mt-24px inline-flex items-center font-manrope text-14 text-pr_purple transition-opacity hover:opacity-80"
          >
            Browse all templates →
          </NextLink>
        </section>

        <section className="mt-72px">
          <SectionHeading>FAQ</SectionHeading>
          <Accordion type="single" defaultValue={['faq-0']}>
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} label={item.q}>
                {item.a}
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mt-72px">
          <CTASection
            title="Build your next product on it"
            subtitle="Install from GitHub Packages, import the tokens, and start composing."
            actions={
              <>
                <LinkButton href="/components/button" variant="secondary">
                  Get started
                </LinkButton>
                <LinkButton href={PACKAGES_URL} variant="secondary" external>
                  GitHub Packages
                </LinkButton>
              </>
            }
          />
        </section>

        <footer className="mt-48px flex flex-wrap items-center justify-between gap-16px border-t border-border-default pt-24px text-14 text-fg-muted">
          <span className="font-display text-fg-primary">
            SagTech <span className="text-pr_purple">UI</span>
          </span>
          <nav className="flex flex-wrap gap-20px">
            <a href={SAGTECH_URL} target="_blank" rel="noreferrer" className="hover:text-fg-primary">
              SagTech.io
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-fg-primary">
              GitHub
            </a>
            <a href={PACKAGES_URL} target="_blank" rel="noreferrer" className="hover:text-fg-primary">
              Packages
            </a>
            <NextLink href="/components/button" className="hover:text-fg-primary">
              Components
            </NextLink>
            <NextLink href="/brand" className="hover:text-fg-primary">
              Brand
            </NextLink>
          </nav>
        </footer>
      </Container>
    </main>
  );
}
