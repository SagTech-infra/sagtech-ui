'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useCommandPalette, Drawer } from '@sagtech-infra/ui';
import { categories, componentsByCategory } from '@/content/registry';
import { guides } from '@/content/guides';
import { templates } from '@/content/templates';
import { ThemeToggle } from './ThemeToggle';

const TOP_LINKS = [
  { href: '/overview', label: 'Overview' },
  { href: '/templates', label: 'Templates' },
  { href: '/brand', label: 'Brand' },
  { href: '/charts', label: 'Charts gallery' },
];

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m14 14 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <NextLink
      href={href}
      onClick={onClick}
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

/** The nav content — shared between the desktop sidebar and the mobile drawer.
    `onNavigate` lets the drawer close itself when a link is tapped. */
function DocsNav({
  pathname,
  openPalette,
  onNavigate,
}: {
  pathname: string;
  openPalette: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          openPalette();
          onNavigate?.();
        }}
        className="mb-20px flex w-full items-center justify-between rounded-10px border border-border-default px-12px py-8px text-14 text-fg-muted hover:border-border-strong"
      >
        <span>Search…</span>
        <kbd className="rounded-6px bg-bg-secondary px-6px py-2px text-12">⌘K</kbd>
      </button>

      <nav>
        <NavGroup title="Get started">
          {TOP_LINKS.map((l) => (
            <NavLink key={l.href} {...l} active={pathname === l.href} onClick={onNavigate} />
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
                onClick={onNavigate}
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
              onClick={onNavigate}
            />
          ))}
        </NavGroup>

        <NavGroup title="Templates">
          {templates.map((t) => (
            <NavLink
              key={t.slug}
              href={`/templates/${t.slug}`}
              label={t.name}
              active={pathname === `/templates/${t.slug}`}
              onClick={onNavigate}
            />
          ))}
        </NavGroup>
      </nav>
    </>
  );
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const palette = useCommandPalette();
  const [navOpen, setNavOpen] = useState(false);

  // Close the mobile drawer whenever the route changes (link tapped / palette nav).
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar (≥lg) */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 overflow-y-auto border-r border-border-default bg-bg-primary p-16px lg:block">
        <NextLink href="/" className="mb-16px block font-orbitron text-18 text-fg-primary">
          SagTech <span className="text-pr_purple">UI</span>
        </NextLink>
        <DocsNav pathname={pathname} openPalette={() => palette.open()} />
      </aside>

      {/* Mobile slide-in nav (dogfoods the library Drawer) */}
      <Drawer
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        position="left"
        width="min(86vw, 320px)"
        title="SagTech UI"
      >
        <DocsNav
          pathname={pathname}
          openPalette={() => palette.open()}
          onNavigate={() => setNavOpen(false)}
        />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (<lg) */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-12px border-b border-border-default bg-bg-primary/80 px-16px py-10px backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            className="flex h-36px w-36px items-center justify-center rounded-8px border border-border-default text-fg-primary hover:border-border-strong"
          >
            <MenuIcon />
          </button>
          <NextLink href="/" className="font-orbitron text-16 text-fg-primary">
            SagTech <span className="text-pr_purple">UI</span>
          </NextLink>
          <div className="flex items-center gap-8px">
            <button
              type="button"
              onClick={() => palette.open()}
              aria-label="Search"
              className="flex h-36px w-36px items-center justify-center rounded-8px border border-border-default text-fg-muted hover:border-border-strong hover:text-fg-primary"
            >
              <SearchIcon />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop top bar (≥lg) */}
        <header className="sticky top-0 z-10 hidden items-center justify-end gap-12px border-b border-border-default bg-bg-primary/80 px-24px py-12px backdrop-blur lg:flex">
          <ThemeToggle />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
