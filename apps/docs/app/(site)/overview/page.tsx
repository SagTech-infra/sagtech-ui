import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { Container, PageHeader, CodeBlock, Accordion, AccordionItem } from '@sagtech-infra/ui';

export const metadata: Metadata = {
  title: 'Overview — SagTech UI',
  description:
    'What SagTech UI is, how to install and use it, and where to report bugs.',
};

// Published package name (public npm). Note: inside this monorepo the library is
// imported via the link alias `@sagtech-infra/ui`; consumers install the
// published name below.
const PKG = '@sagtech_llc/ui';
const NPM_URL = 'https://www.npmjs.com/package/@sagtech_llc/ui';
const REPO_URL = 'https://github.com/SagTech-infra/sagtech-ui';
const ISSUES_URL = 'https://github.com/SagTech-infra/sagtech-ui/issues';

const INSTALL_CODE = `# public npm — no auth required
pnpm add ${PKG}`;

const TOKENS_CODE = `/* app/globals.css — import the design tokens once */
@import '${PKG}/tokens';`;

const PROVIDER_CODE = `// app/providers.tsx
'use client';
import { SagtechUIProvider } from '${PKG}';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SagtechUIProvider defaultTheme="dark">{children}</SagtechUIProvider>;
}`;

const USAGE_CODE = `import { Button } from '${PKG}';

export default function Example() {
  return <Button>Click me</Button>;
}`;

const FAQ = [
  {
    q: 'How do I install it?',
    a: `It's published to public npm. Run \`pnpm add ${PKG}\` — no token or registry config required.`,
  },
  {
    q: 'How do I get the styles?',
    a: `Import the tokens once at the top of your global stylesheet: \`@import '${PKG}/tokens';\` — it ships the @theme block, gradients and animations.`,
  },
  {
    q: 'Does it work without Next.js?',
    a: 'Yes. Alias next/image · next/link · next/dynamic to shims, or wrap your app in SagtechUIProvider and pass your own image/link components.',
  },
  {
    q: 'Are charts and 3D bundled in?',
    a: `No — they are optional peer deps behind the \`${PKG}/charts\` and \`${PKG}/3d\` subpath exports. You only pay for what you import.`,
  },
  {
    q: 'Is there a light theme?',
    a: 'Dark-first by design; light mode is fully supported via ThemeProvider (sets data-theme), with brand accents tuned for AA on light surfaces.',
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-40px">
      <h2 className="mb-16px font-orbitron text-28 text-fg-primary">{title}</h2>
      {children}
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-pr_purple transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  );
}

export default function OverviewPage() {
  return (
    <Container size="lg" as="main" className="py-48px">
      <PageHeader
        eyebrow="Get started"
        title="Overview"
        subtitle="SagTech UI — a production React component library. 107 components, charts and 3D, dark by default."
      />

      <Section title="What is it">
        <p className="max-w-[720px] text-16 leading-26 text-fg-secondary">
          SagTech UI is a React&nbsp;19 + Tailwind&nbsp;v4 component library used across SagTech
          products — this very site is built with it. It ships 107 components across 8 categories,
          12 chart types and 4 interactive 3D scenes. Dark-first, accessible by default, and
          tree-shakeable: import a button, ship a button.
        </p>
        <p className="mt-12px max-w-[720px] text-14 leading-24 text-fg-muted">
          Browse the full catalogue in the sidebar, or start from a ready-made{' '}
          <NextLink href="/templates" className="text-pr_purple hover:opacity-80">
            full-page template
          </NextLink>
          .
        </p>
      </Section>

      <Section title="Install">
        <p className="mb-12px text-14 text-fg-muted">1. Add the package from npm:</p>
        <CodeBlock language="bash" code={INSTALL_CODE} />

        <p className="mb-12px mt-24px text-14 text-fg-muted">
          2. Import the design tokens once in your global stylesheet:
        </p>
        <CodeBlock language="css" filename="app/globals.css" code={TOKENS_CODE} />

        <p className="mb-12px mt-24px text-14 text-fg-muted">
          3. Wrap your app in the provider (Next.js shown — for other React apps, alias the{' '}
          <code className="text-sec_purple">next/*</code> imports instead):
        </p>
        <CodeBlock language="tsx" filename="app/providers.tsx" code={PROVIDER_CODE} />
      </Section>

      <Section title="Quick example">
        <CodeBlock language="tsx" filename="example.tsx" showLineNumbers code={USAGE_CODE} />
      </Section>

      <Section title="Report a bug">
        <p className="max-w-[720px] text-16 leading-26 text-fg-secondary">
          Found something broken or missing? Open an issue on GitHub with a short repro — it goes
          straight to the team that maintains the library.
        </p>
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-16px inline-flex items-center rounded-12px bg-pr_purple px-20px py-10px font-manrope text-14 text-white transition-opacity hover:opacity-90"
        >
          Report a bug on GitHub →
        </a>
      </Section>

      <Section title="Links & resources">
        <ul className="flex flex-col gap-8px text-16 text-fg-secondary">
          <li>
            <ExternalLink href={NPM_URL}>npm package — {PKG}</ExternalLink>
          </li>
          <li>
            <ExternalLink href={REPO_URL}>GitHub repository</ExternalLink>
          </li>
          <li>
            <ExternalLink href={ISSUES_URL}>Report a bug (GitHub Issues)</ExternalLink>
          </li>
          <li>
            <NextLink href="/components/button" className="text-pr_purple hover:opacity-80">
              Component catalogue
            </NextLink>
          </li>
          <li>
            <NextLink href="/guides/theming" className="text-pr_purple hover:opacity-80">
              Theming guide
            </NextLink>
          </li>
          <li>
            <NextLink href="/guides/migration" className="text-pr_purple hover:opacity-80">
              Migration guide
            </NextLink>
          </li>
        </ul>
      </Section>

      <Section title="FAQ">
        <Accordion type="single" defaultValue={['faq-0']}>
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} label={item.q}>
              {item.a}
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </Container>
  );
}
