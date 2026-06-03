'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { CodeBlock, SegmentedControl } from '@sagtech-infra/ui';
import { templateRegistry } from '@/content/template-registry';
import { ThemeToggle } from './ThemeToggle';

const VIEW_OPTIONS = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
];

/** Full-bleed chrome for a template page: thin top bar (back to gallery,
    title, Preview/Code toggle, theme toggle) over either the live template or
    its exact source. Lives outside the docs shell so the template renders like
    a real product page. */
export function TemplateFrame({
  slug,
  title,
  source,
}: {
  slug: string;
  title: string;
  source: string;
}) {
  const [view, setView] = useState('preview');
  const Live = templateRegistry[slug];

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-12px border-b border-border-default bg-bg-primary/80 px-24px py-12px backdrop-blur">
        <NextLink
          href="/templates"
          className="flex items-center gap-8px text-14 text-fg-muted transition-colors hover:text-fg-primary"
        >
          <span aria-hidden>←</span>
          <span className="font-orbitron">
            SagTech <span className="text-pr_purple">UI</span>
          </span>
        </NextLink>

        <span className="hidden truncate font-orbitron text-16 text-fg-primary sm:block">
          {title} template
        </span>

        <div className="flex items-center gap-12px">
          <SegmentedControl
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
            size="sm"
            aria-label="Preview or source code"
          />
          <ThemeToggle />
        </div>
      </header>

      <main className="min-w-0 flex-1">
        {view === 'preview' ? (
          Live ? <Live /> : null
        ) : (
          <div className="mx-auto max-w-[960px] p-24px">
            {source ? (
              <CodeBlock
                code={source}
                language="tsx"
                copyable
                showLineNumbers
                maxHeight="calc(100vh - 140px)"
              />
            ) : (
              <p className="text-14 text-grey_3">Source unavailable.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
