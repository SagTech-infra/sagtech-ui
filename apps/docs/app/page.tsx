import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import NextLink from 'next/link';
import {
  Container,
  AuroraHero,
  FeatureGrid,
  CTASection,
  Accordion,
  AccordionItem,
} from '@sagtech-infra/ui';
import { LandingShowcase } from '@/components/LandingShowcase';
import { HomeTemplateShowcase } from '@/components/HomeTemplateShowcase';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  description:
    'Components that ship as fast as you do — 107 React components, charts, 3D and full-page templates. Dark by default, accessible by default.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'SagTech UI',
    description: 'Components that ship as fast as you do — a production React component library.',
    url: '/',
  },
};

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
  variant?: 'primary' | 'secondary' | 'onGradientPrimary' | 'onGradientSecondary';
  external?: boolean;
  className?: string;
}) {
  // `onGradient*` variants use fixed light-on-purple colors for the always-purple
  // CTA band, so they stay readable in both the dark and the light theme.
  const variants: Record<string, string> = {
    primary: 'bg-pr_purple text-white hover:opacity-90',
    secondary: 'border border-border-strong text-fg-primary hover:bg-bg-secondary',
    onGradientPrimary: 'bg-white text-pr_purple hover:opacity-90',
    onGradientSecondary: 'border border-white/40 text-white hover:bg-white/10',
  };
  const cls =
    'inline-flex items-center rounded-12px px-20px py-10px font-manrope text-14 transition-colors ' +
    variants[variant] +
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

// Folded into the AuroraHero stat strip (AuroraStat.value is a string).
const STATS = [
  { value: '107', label: 'Components' },
  { value: '12', label: 'Chart types' },
  { value: '4', label: '3D scenes' },
  { value: '2', label: 'Themes' },
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
      {/* Slim top bar — the homepage lives outside the DocsShell, so it carries
          its own logo + global light/dark toggle (ThemeProvider writes the
          choice to <html data-theme> and persists it). */}
      <header className="sticky top-0 z-30 border-b border-border-default bg-bg-primary/80 backdrop-blur">
        <Container size="lg" className="flex items-center justify-between py-12px">
          <NextLink href="/" className="font-display text-16 text-fg-primary">
            SagTech <span className="text-pr_purple">UI</span>
          </NextLink>
          <nav className="flex items-center gap-16px">
            <NextLink
              href="/components/button"
              className="hidden text-14 text-fg-muted transition-colors hover:text-fg-primary sm:inline"
            >
              Components
            </NextLink>
            <NextLink
              href="/templates"
              className="hidden text-14 text-fg-muted transition-colors hover:text-fg-primary sm:inline"
            >
              Templates
            </NextLink>
            <NextLink
              href="/overview"
              className="hidden text-14 text-fg-muted transition-colors hover:text-fg-primary sm:inline"
            >
              Docs
            </NextLink>
            <ThemeToggle />
          </nav>
        </Container>
      </header>

      <AuroraHero
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
        stats={STATS}
      />

      <Container size="lg" className="pb-72px">
        <section className="mt-8px">
          <SectionHeading>Built by SagTech</SectionHeading>
          <div className="border_gradient_24_stroke_2 rounded-24px p-32px shadow-3xl">
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
          <p className="mb-24px max-w-[680px] text-16 text-fg-muted">
            Full pages assembled entirely from these components — flip between dark and the warm
            light theme, then open one to copy the code.
          </p>
          <HomeTemplateShowcase />
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
                <LinkButton href="/components/button" variant="onGradientPrimary">
                  Get started
                </LinkButton>
                <LinkButton href={PACKAGES_URL} variant="onGradientSecondary" external>
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
