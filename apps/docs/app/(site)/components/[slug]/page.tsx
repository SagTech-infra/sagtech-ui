import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import { Container, PageHeader } from '@sagtech-infra/ui';
import { components, getComponent } from '@/content/registry';
import { DemoBlock } from '@/components/DemoBlock';
import { PropsTable } from '@/components/PropsTable';

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

function readDemoSource(name: string): string {
  try {
    return readFileSync(
      join(process.cwd(), 'demos', name, 'basic.tsx'),
      'utf8',
    ).trimEnd();
  } catch {
    return '';
  }
}

function readDescription(name: string): string {
  try {
    const raw = readFileSync(join(process.cwd(), 'demos', name, 'meta.json'), 'utf8');
    return (JSON.parse(raw) as { description?: string }).description ?? '';
  } catch {
    return '';
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getComponent(slug);
  if (!entry) notFound();

  const source = readDemoSource(entry.name);
  const description = readDescription(entry.name);

  return (
    <Container size="lg" as="article" className="py-48px">
      <PageHeader
        eyebrow={entry.category}
        title={entry.name}
        subtitle={description || undefined}
      />

      <section className="mt-32px">
        <h2 className="mb-16px font-orbitron text-28">Example</h2>
        <DemoBlock slug={entry.slug} source={source} />
      </section>

      <section className="mt-48px">
        <h2 className="mb-16px font-orbitron text-28">Props</h2>
        <PropsTable name={entry.name} />
      </section>

      <p className="mt-32px text-12 text-grey_3">
        Proudly made by <span className="text-sec_purple">SagTech</span>
      </p>
    </Container>
  );
}
