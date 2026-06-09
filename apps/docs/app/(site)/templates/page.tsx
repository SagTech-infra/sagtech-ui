import type { Metadata } from 'next';
import NextLink from 'next/link';
import { Container, PageHeader } from '@sagtech-infra/ui';
import { templates } from '@/content/templates';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Full-page templates assembled entirely from SagTech UI components.',
  alternates: { canonical: '/templates' },
  openGraph: { title: 'Templates — SagTech UI', description: 'Full-page templates assembled entirely from SagTech UI components.', url: '/templates' },
};

// Templates INDEX. Lives inside the (site) route group so it inherits the
// DocsShell sidebar (like Brand/Charts). The per-template viewer stays
// full-bleed at app/templates/[slug]/page.tsx (outside the shell).
export default function TemplatesIndexPage() {
  return (
    <Container size="lg" as="main" className="py-48px">
      <PageHeader
        eyebrow="Templates"
        title="Full-page templates"
        subtitle="Production-ready pages assembled entirely from the component library. Open one, flip to Code, copy."
      />

      <div className="mt-32px grid grid-cols-1 gap-24px sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <NextLink
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="group block rounded-24px border border-border-default bg-bg-secondary p-24px transition-all duration-200 hover:-translate-y-[2px] hover:border-border-strong"
          >
            <p className="font-orbitron text-12 uppercase tracking-wider text-grey_2">
              {t.kind}
            </p>
            <h2 className="mt-12px font-orbitron text-18 text-fg-primary">{t.name}</h2>
            <p className="mt-8px text-14 text-fg-muted">{t.description}</p>
            <span className="mt-24px inline-flex items-center gap-6px text-14 text-pr_purple opacity-0 transition-opacity group-hover:opacity-100">
              View template →
            </span>
          </NextLink>
        ))}
      </div>
    </Container>
  );
}
