'use client';

import { CodeBlock } from '@sagtech-infra/ui';
import { demoRegistry } from '@/content/demos-index';

/** Renders a live example (client-only, so canvas/WebGL demos never run during
    SSR) above its exact source code. Source is read on the server and passed in. */
export function DemoBlock({ slug, source }: { slug: string; source: string }) {
  const Demo = demoRegistry[slug];

  return (
    <div className="overflow-hidden rounded-16px border border-border-default">
      <div className="flex min-h-[200px] items-center justify-center p-24px bg-bg-secondary">
        {Demo ? (
          <Demo />
        ) : (
          <span className="text-14 text-grey_3">Example coming soon.</span>
        )}
      </div>
      {source ? (
        <CodeBlock code={source} language="tsx" copyable showLineNumbers />
      ) : null}
    </div>
  );
}
