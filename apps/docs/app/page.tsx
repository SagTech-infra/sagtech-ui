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
  { title: 'Dark-first', description: 'Tokenized theme; light mode tuned for AA contrast.' },
  { title: 'Charts & 3D', description: '12 canvas charts + WebGL scenes, lazy-loaded behind subpaths.' },
  { title: 'Accessible', description: 'WAI-ARIA patterns, focus management, jest-axe in CI.' },
  { title: 'Tree-shakeable', description: 'sideEffects:false + /charts and /3d subpath exports.' },
  { title: 'SSR / Next', description: 'Framework-agnostic via SagtechUIProvider image/link injection.' },
  { title: 'Dogfooded', description: 'This entire site is built from the library it documents.' },
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
        subtitle="A dark-first React component library — 107 components, charts, 3D and accessibility, dogfooded by these very docs."
        actions={
          <>
            <LinkButton href="/components/button">Browse components</LinkButton>
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
