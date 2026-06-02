'use client';

import NextLink from 'next/link';
import { Container } from '@sagtech-infra/ui';
import { componentsByCategory } from '@/content/registry';
import { demoRegistry } from '@/content/demos-index';

export default function ChartsGallery() {
  const items = componentsByCategory('Charts');

  return (
    <Container size="xl" as="main" className="py-48px">
      <h1 className="font-orbitron text-40">Charts</h1>
      <p className="mb-32px mt-8px text-16 text-white_1">
        Canvas-rendered and theme-aware. Import from{' '}
        <code className="text-sec_purple">@sagtech-infra/ui/charts</code>.
      </p>
      <div className="grid grid-cols-1 gap-24px md:grid-cols-2">
        {items.map((c) => {
          const Demo = demoRegistry[c.slug];
          return (
            <NextLink
              key={c.slug}
              href={`/components/${c.slug}`}
              className="block rounded-16px border border-border-default p-16px transition-colors hover:border-border-strong"
            >
              <p className="mb-12px font-orbitron text-16">{c.name}</p>
              <div className="flex min-h-[200px] items-center justify-center">
                {Demo ? <Demo /> : <span className="text-14 text-grey_3">—</span>}
              </div>
            </NextLink>
          );
        })}
      </div>
    </Container>
  );
}
