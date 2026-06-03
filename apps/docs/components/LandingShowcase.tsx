'use client';

import { demoRegistry } from '@/content/demos-index';

// Real library components rendered live on the landing — "the page is the library".
// Uses the ssr:false demo registry so canvas/WebGL never run during prerender.
const SHOW = ['area-chart', 'bar-chart', 'donut-chart', 'globe-3-d'];

export function LandingShowcase() {
  return (
    <div className="grid grid-cols-1 gap-16px md:grid-cols-2">
      {SHOW.map((slug) => {
        const Demo = demoRegistry[slug];
        return (
          <div
            key={slug}
            className="flex min-h-[240px] items-center justify-center rounded-16px border border-border-default bg-bg-secondary p-16px"
          >
            {Demo ? <Demo /> : null}
          </div>
        );
      })}
    </div>
  );
}
