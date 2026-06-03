import type { Metadata } from 'next';
import NextLink from 'next/link';
import { Container } from '@sagtech-infra/ui';
import { templates } from '@/content/templates';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Templates — SagTech UI',
  description:
    'Full-page templates assembled entirely from @sagtech-infra/ui components.',
};

export default function TemplatesIndexPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-default bg-bg-primary/80 px-24px py-12px backdrop-blur">
        <NextLink
          href="/"
          className="flex items-center gap-8px text-14 text-fg-muted transition-colors hover:text-fg-primary"
        >
          <span aria-hidden>←</span>
          <span className="font-orbitron">
            SagTech <span className="text-pr_purple">UI</span>
          </span>
        </NextLink>
        <ThemeToggle />
      </header>

      <Container size="lg" as="main" className="py-64px">
        <p className="font-orbitron text-12 uppercase tracking-wider text-pr_purple">
          Templates
        </p>
        <h1 className="mt-8px font-orbitron text-40 text-fg-primary">
          Full-page templates
        </h1>
        <p className="mt-12px max-w-[640px] text-16 text-fg-secondary">
          Production-ready pages assembled entirely from{' '}
          <code className="text-sec_purple">@sagtech-infra/ui</code> components.
          Open one, flip to Code, copy.
        </p>

        <div className="mt-48px grid grid-cols-1 gap-24px sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <NextLink
              key={t.slug}
              href={`/templates/${t.slug}`}
              className="group block rounded-24px border border-border-default bg-bg-secondary p-24px transition-all duration-200 hover:-translate-y-[2px] hover:border-border-strong"
            >
              <p className="font-orbitron text-12 uppercase tracking-wider text-grey_2">
                {t.kind}
              </p>
              <h2 className="mt-12px font-orbitron text-18 text-fg-primary">
                {t.name}
              </h2>
              <p className="mt-8px text-14 text-fg-muted">{t.description}</p>
              <span className="mt-24px inline-flex items-center gap-6px text-14 text-pr_purple opacity-0 transition-opacity group-hover:opacity-100">
                View template →
              </span>
            </NextLink>
          ))}
        </div>
      </Container>
    </div>
  );
}
