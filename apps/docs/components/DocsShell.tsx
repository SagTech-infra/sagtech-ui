'use client';

import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useCommandPalette } from '@sagtech-infra/ui';
import { categories, componentsByCategory } from '@/content/registry';
import { guides } from '@/content/guides';
import { ThemeToggle } from './ThemeToggle';

const TOP_LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/brand', label: 'Brand' },
  { href: '/charts', label: 'Charts gallery' },
  { href: '/three', label: '3D gallery' },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <NextLink
      href={href}
      className={`block rounded-8px px-12px py-6px text-14 transition-colors ${
        active
          ? 'bg-bg-tertiary text-fg-primary'
          : 'text-fg-muted hover:text-fg-primary hover:bg-bg-secondary'
      }`}
    >
      {label}
    </NextLink>
  );
}

function NavGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-20px">
      <p className="px-12px mb-6px font-orbitron text-12 uppercase tracking-wider text-grey_2">
        {title}
      </p>
      <div className="flex flex-col gap-2px">{children}</div>
    </div>
  );
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const palette = useCommandPalette();

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 h-screen w-[272px] shrink-0 overflow-y-auto border-r border-border-default bg-bg-primary p-16px">
        <NextLink href="/" className="mb-16px block font-orbitron text-18 text-fg-primary">
          SagTech <span className="text-pr_purple">UI</span>
        </NextLink>

        <button
          type="button"
          onClick={() => palette.open()}
          className="mb-20px flex w-full items-center justify-between rounded-10px border border-border-default px-12px py-8px text-14 text-fg-muted hover:border-border-strong"
        >
          <span>Search…</span>
          <kbd className="rounded-6px bg-bg-secondary px-6px py-2px text-12">⌘K</kbd>
        </button>

        <nav>
          <NavGroup title="Get started">
            {TOP_LINKS.map((l) => (
              <NavLink key={l.href} {...l} active={pathname === l.href} />
            ))}
          </NavGroup>

          {categories.map((category) => (
            <NavGroup key={category} title={category}>
              {componentsByCategory(category).map((c) => (
                <NavLink
                  key={c.slug}
                  href={`/components/${c.slug}`}
                  label={c.name}
                  active={pathname === `/components/${c.slug}`}
                />
              ))}
            </NavGroup>
          ))}

          <NavGroup title="Guides">
            {guides.map((g) => (
              <NavLink
                key={g.slug}
                href={`/guides/${g.slug}`}
                label={g.title}
                active={pathname === `/guides/${g.slug}`}
              />
            ))}
          </NavGroup>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-end gap-12px border-b border-border-default bg-bg-primary/80 px-24px py-12px backdrop-blur">
          <ThemeToggle />
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
