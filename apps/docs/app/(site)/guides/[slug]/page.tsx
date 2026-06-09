import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, PageHeader } from '@sagtech-infra/ui';
import { guides, getGuide } from '@/content/guides';
import { Markdown } from '@/components/Markdown';

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: { title: `${guide.title} — SagTech UI`, description: guide.description, url: `/guides/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  let source: string;
  try {
    // cwd is apps/docs at build; library docs live at repo-root/docs.
    source = readFileSync(join(process.cwd(), '..', '..', 'docs', guide.file), 'utf8');
  } catch {
    source = `# ${guide.title}\n\n_Guide source not found._`;
  }

  return (
    <Container size="md" as="article" className="py-48px">
      <PageHeader eyebrow="Guide" title={guide.title} subtitle={guide.description} />
      <div className="mt-24px">
        <Markdown source={source} />
      </div>
    </Container>
  );
}
