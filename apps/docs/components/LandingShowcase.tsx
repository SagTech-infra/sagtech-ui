'use client';

import NextLink from 'next/link';
import { demoRegistry } from '@/content/demos-index';

// A bento grid of varied real components (not just charts) — "the page is the
// library". Each tile renders the component's ssr:false demo and links to its page.
const TILES: { slug: string; name: string; span: string }[] = [
  { slug: 'globe-3-d', name: 'Globe3D', span: 'col-span-2 row-span-2' },
  { slug: 'area-chart', name: 'AreaChart', span: 'col-span-2' },
  { slug: 'button', name: 'Button', span: 'col-span-1' },
  { slug: 'rate', name: 'Rate', span: 'col-span-1' },
  { slug: 'calendar', name: 'Calendar', span: 'col-span-2 row-span-2' },
  { slug: 'alert', name: 'Alert', span: 'col-span-2' },
  { slug: 'bar-chart', name: 'BarChart', span: 'col-span-2' },
  { slug: 'avatar-group', name: 'AvatarGroup', span: 'col-span-1' },
  { slug: 'switch', name: 'Switch', span: 'col-span-1' },
];

export function LandingShowcase() {
  return (
    <div className="grid auto-rows-[176px] grid-cols-2 gap-16px [grid-auto-flow:dense] lg:grid-cols-4">
      {TILES.map((t) => {
        const Demo = demoRegistry[t.slug];
        return (
          <NextLink
            key={t.slug}
            href={`/components/${t.slug}`}
            className={`group relative flex items-center justify-center overflow-hidden rounded-16px border border-border-default bg-bg-secondary p-16px transition-colors hover:border-border-strong ${t.span}`}
          >
            <span className="absolute left-12px top-12px z-10 font-display text-12 text-grey_3 transition-colors group-hover:text-fg-primary">
              {t.name}
            </span>
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              {Demo ? <Demo /> : null}
            </div>
          </NextLink>
        );
      })}
    </div>
  );
}
