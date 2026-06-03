'use client';

import NextLink from 'next/link';
import { demoRegistry } from '@/content/demos-index';

// MagicUI-style bento: each card shows a live component preview as the background
// (faded for readability), with a title/description that lift on hover to reveal a
// "View →" CTA. The preview is pointer-events-none; an overlay link handles clicks
// (so interactive demos never sit inside an anchor).
interface Tile {
  slug: string;
  name: string;
  description: string;
  span?: string;
}

const TILES: Tile[] = [
  { slug: 'globe-3-d', name: 'Globe3D', description: 'Interactive WebGL globe with live markers.', span: 'sm:col-span-2 lg:col-span-2 lg:row-span-2' },
  { slug: 'calendar', name: 'Calendar', description: 'Locale-aware date picking.', span: 'lg:row-span-2' },
  { slug: 'area-chart', name: 'AreaChart', description: 'Theme-aware canvas charts.' },
  { slug: 'button', name: 'Button', description: 'Variants, sizes, loading, icons.' },
  { slug: 'alert', name: 'Alert', description: 'Status messages with actions.', span: 'sm:col-span-2 lg:col-span-1' },
  { slug: 'rate', name: 'Rate', description: 'Star rating input.' },
  { slug: 'bar-chart', name: 'BarChart', description: 'Bar and grouped series.' },
  { slug: 'avatar-group', name: 'AvatarGroup', description: 'Stacked avatars with overflow.' },
  { slug: 'switch', name: 'Switch', description: 'Accessible toggle.' },
];

function BentoCard({ slug, name, description, span = '' }: Tile) {
  const Demo = demoRegistry[slug];
  return (
    <div
      className={`group relative flex flex-col justify-end overflow-hidden rounded-24px border border-border-default bg-bg-secondary ${span}`}
    >
      {/* Live preview as the card background. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-24px">
        <div className="flex max-h-full w-full scale-90 items-center justify-center opacity-80 transition-transform duration-300 group-hover:scale-95">
          {Demo ? <Demo /> : null}
        </div>
      </div>

      {/* Fade so the title/description stay readable over the preview. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{ background: 'linear-gradient(to top, var(--color-bg-secondary) 38%, transparent)' }}
      />

      {/* Text lifts on hover to make room for the CTA. */}
      <div
        className="pointer-events-none relative z-10 p-20px transition-transform duration-300 group-hover:-translate-y-16px"
        style={{ transitionTimingFunction: 'var(--motion-ease-tech)' }}
      >
        <h3 className="font-display text-16 text-fg-primary">{name}</h3>
        <p className="mt-4px text-13 leading-18 text-fg-muted">{description}</p>
      </div>

      <span className="pointer-events-none absolute bottom-16px left-20px z-10 inline-flex translate-y-8px items-center text-13 text-sec_purple opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        View →
      </span>

      {/* Click target on top (keeps interactive demos out of the anchor). */}
      <NextLink
        href={`/components/${slug}`}
        aria-label={name}
        className="absolute inset-0 z-20 rounded-24px transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple"
      />
    </div>
  );
}

export function LandingShowcase() {
  return (
    <div className="grid auto-rows-[15rem] grid-cols-1 gap-16px [grid-auto-flow:dense] sm:grid-cols-2 lg:grid-cols-3">
      {TILES.map((t) => (
        <BentoCard key={t.slug} {...t} />
      ))}
    </div>
  );
}
