'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@sagtech-infra/ui';
import { templates, type TemplateEntry } from '@/content/templates';
import { templateRegistry } from '@/content/template-registry';

// Width the full-page templates are composed for; the live preview is rendered
// at this width and scaled to fit the frame (a website-thumbnail of the top).
const DESIGN_W = 1320;
const KIND_ORDER: TemplateEntry['kind'][] = ['App', 'Marketing'];

/** Tracks an element's content width (for the scale-to-fit preview). */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function TemplatesShowcase() {
  const [selected, setSelected] = useState(templates[0].slug);
  const [frameRef, frameW] = useWidth<HTMLDivElement>();

  const active = templates.find((t) => t.slug === selected) ?? templates[0];
  const Live = templateRegistry[selected];
  const scale = frameW ? frameW / DESIGN_W : 0.55;

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: templates.filter((t) => t.kind === kind),
  })).filter((g) => g.items.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mt-32px grid gap-24px lg:grid-cols-[300px_1fr]"
    >
      {/* ───────── list ───────── */}
      <div className="flex flex-col gap-20px">
        {grouped.map((group) => (
          <div key={group.kind}>
            <p className="mb-8px px-4px font-orbitron text-12 uppercase tracking-wider text-grey_2">
              {group.kind} templates
            </p>
            <div className="flex flex-col gap-6px">
              {group.items.map((t) => {
                const isActive = t.slug === selected;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    aria-pressed={isActive}
                    onMouseEnter={() => setSelected(t.slug)}
                    onFocus={() => setSelected(t.slug)}
                    onClick={() => setSelected(t.slug)}
                    className={`group relative flex items-center justify-between overflow-hidden rounded-12px border px-16px py-12px text-left transition-all duration-200 ${
                      isActive
                        ? 'border-pr_purple bg-bg-tertiary shadow-3xl'
                        : 'border-border-default bg-bg-secondary hover:-translate-y-[1px] hover:border-border-strong hover:bg-bg-tertiary'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-0 top-1/2 h-[58%] w-[3px] -translate-y-1/2 rounded-r-full bg-pr_purple transition-opacity duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <span className="font-orbitron text-16 text-fg-primary">{t.name}</span>
                    <span
                      aria-hidden
                      className={`text-14 text-pr_purple transition-all duration-200 ${
                        isActive ? 'translate-x-0 opacity-100' : '-translate-x-[6px] opacity-0 group-hover:opacity-50'
                      }`}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <p className="px-4px text-12 text-grey_3">
          {templates.length} full-page templates · hover to preview, open for the code
        </p>
      </div>

      {/* ───────── preview ───────── */}
      <div className="flex flex-col gap-16px">
        <div className="relative overflow-hidden rounded-16px border border-border-default bg-bg-secondary shadow-3xl">
          {/* soft brand glow behind the frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px z-0"
            style={{
              background:
                'radial-gradient(600px circle at 80% -10%, rgba(109,62,241,0.18), transparent 60%)',
            }}
          />
          {/* browser chrome */}
          <div className="relative z-10 flex items-center gap-12px border-b border-border-default bg-bg-primary px-16px py-10px">
            <div className="flex gap-6px">
              <span className="h-[10px] w-[10px] rounded-full bg-error" />
              <span className="h-[10px] w-[10px] rounded-full bg-warning" />
              <span className="h-[10px] w-[10px] rounded-full bg-success" />
            </div>
            <div className="flex-1 truncate rounded-8px bg-bg-tertiary px-12px py-4px text-center font-mono text-12 text-grey_3">
              ui.sagtech.io/templates/{selected}
            </div>
          </div>

          {/* scaled live preview — click opens the full template */}
          <NextLink
            href={`/templates/${selected}`}
            aria-label={`Open the ${active.name} template`}
            className="relative z-10 block"
          >
            <div
              ref={frameRef}
              className="relative h-[300px] overflow-hidden bg-bg-primary sm:h-[420px] lg:h-[480px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 origin-top-left"
                    style={{ width: DESIGN_W, transform: `scale(${scale})` }}
                  >
                    {Live ? <Live /> : null}
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* bottom fade so the crop reads as intentional */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[80px]"
                style={{ background: 'linear-gradient(to top, var(--color-bg-primary, #070713), transparent)' }}
              />
            </div>
          </NextLink>
        </div>

        {/* meta + CTA */}
        <div className="flex flex-wrap items-end justify-between gap-16px">
          <div className="min-w-0">
            <div className="flex items-center gap-12px">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={active.slug}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-orbitron text-28 text-fg-primary"
                >
                  {active.name}
                </motion.h2>
              </AnimatePresence>
              <Badge variant="outlined" color="purple" size="sm">
                {active.kind}
              </Badge>
            </div>
            <p className="mt-4px max-w-[560px] text-14 text-fg-muted">{active.description}</p>
          </div>
          <NextLink
            href={`/templates/${selected}`}
            className="inline-flex shrink-0 items-center gap-8px rounded-12px bg-pr_purple px-20px py-10px font-manrope text-14 text-white transition-opacity hover:opacity-90"
          >
            Open template →
          </NextLink>
        </div>
      </div>
    </motion.div>
  );
}

export default TemplatesShowcase;
