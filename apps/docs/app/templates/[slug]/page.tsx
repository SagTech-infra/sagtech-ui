import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { templates, getTemplate } from '@/content/templates';
import { TemplateFrame } from '@/components/TemplateFrame';

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getTemplate(slug);
  return entry
    ? { title: `${entry.name} template — SagTech UI`, description: entry.description }
    : {};
}

function readTemplateSource(file: string): string {
  try {
    return readFileSync(
      join(process.cwd(), 'components', 'templates', file),
      'utf8',
    ).trimEnd();
  } catch {
    return '';
  }
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getTemplate(slug);
  if (!entry) notFound();

  const source = readTemplateSource(entry.file);

  return <TemplateFrame slug={entry.slug} title={entry.name} source={source} />;
}
