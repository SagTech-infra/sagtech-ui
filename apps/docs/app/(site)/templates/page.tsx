import type { Metadata } from 'next';
import { Container, PageHeader } from '@sagtech-infra/ui';
import { TemplatesShowcase } from './TemplatesShowcase';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Full-page templates assembled entirely from SagTech UI components.',
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'Templates — SagTech UI',
    description: 'Full-page templates assembled entirely from SagTech UI components.',
    url: '/templates',
  },
};

// Templates INDEX. Lives inside the (site) route group so it inherits the
// DocsShell sidebar; the interactive live-preview showcase is a client child.
export default function TemplatesIndexPage() {
  return (
    <Container size="xl" as="main" className="py-48px">
      <PageHeader
        eyebrow="Templates"
        title="Full-page templates"
        subtitle="Production-ready pages assembled entirely from the component library — hover to preview, open to read the code."
      />
      <TemplatesShowcase />
    </Container>
  );
}
