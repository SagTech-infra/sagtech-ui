'use client';

import NextLink from 'next/link';
import { Container } from '@sagtech-infra/ui';
import { componentsByCategory } from '@/content/registry';
import { demoRegistry } from '@/content/demos-index';

export default function ThreeGallery() {
  const items = componentsByCategory('3D');

  return (
    <Container size="xl" as="main" className="py-48px">
      <h1 className="font-orbitron text-40">3D</h1>
      <p className="mb-32px mt-8px text-16 text-white_1">
        WebGL scenes, lazy-loaded and client-only. Import from{' '}
        <code className="text-sec_purple">@sagtech-infra/ui/3d</code>.
      </p>
      <div className="grid grid-cols-1 gap-24px md:grid-cols-2">
        {items.map((c) => {
          const Demo = demoRegistry[c.slug];
          return (
            <NextLink
              key={c.slug}
              href={`/components/${c.slug}`}
              className="block overflow-hidden rounded-16px border border-border-default p-16px transition-colors hover:border-border-strong"
            >
              <p className="mb-12px font-orbitron text-16">{c.name}</p>
              {/* Demos render at a fixed pixel size (500–600px); clip + scale so
                  the preview fits the gallery card. pointer-events-none keeps the
                  WebGL canvas from swallowing the card's navigation click. */}
              <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-12px">
                {Demo ? (
                  <div className="pointer-events-none origin-center scale-[0.5]">
                    <Demo />
                  </div>
                ) : (
                  <span className="text-14 text-grey_3">—</span>
                )}
              </div>
            </NextLink>
          );
        })}
      </div>
    </Container>
  );
}
