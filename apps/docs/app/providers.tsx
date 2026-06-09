'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NextImage, { type ImageProps } from 'next/image';
import NextLink from 'next/link';
import { SagtechUIProvider, CommandPaletteProvider } from '@sagtech-infra/ui';
import { components } from '@/content/registry';
import { guides } from '@/content/guides';
import { templates } from '@/content/templates';

/* Adapt next/image + next/link to the library's injection contracts so
   framework-agnostic components render with real Next primitives. */
function ImageAdapter(props: Record<string, unknown>) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <NextImage {...(props as unknown as ImageProps)} />;
}

function LinkAdapter({
  href,
  children,
  ...rest
}: { href: string; children?: ReactNode } & Record<string, unknown>) {
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
  );
}

/** Wires the command palette (Cmd/Ctrl-K) with navigation to every page. */
function PaletteProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const baseCommands = useMemo(
    () => [
      {
        id: 'nav-overview',
        label: 'Overview',
        group: 'Navigate',
        onSelect: () => router.push('/overview'),
      },
      {
        id: 'nav-brand',
        label: 'Brand',
        group: 'Navigate',
        onSelect: () => router.push('/brand'),
      },
      {
        id: 'nav-charts',
        label: 'Charts gallery',
        group: 'Navigate',
        onSelect: () => router.push('/charts'),
      },
      {
        id: 'nav-three',
        label: '3D gallery',
        group: 'Navigate',
        onSelect: () => router.push('/three'),
      },
      ...templates.map((t) => ({
        id: `template-${t.slug}`,
        label: `${t.name} template`,
        description: t.description,
        group: 'Templates',
        onSelect: () => router.push(`/templates/${t.slug}`),
      })),
      ...guides.map((g) => ({
        id: `guide-${g.slug}`,
        label: g.title,
        description: g.description,
        group: 'Guides',
        onSelect: () => router.push(`/guides/${g.slug}`),
      })),
      ...components.map((c) => ({
        id: `component-${c.slug}`,
        label: c.name,
        description: c.category,
        group: c.category,
        onSelect: () => router.push(`/components/${c.slug}`),
      })),
    ],
    [router],
  );

  return (
    <CommandPaletteProvider
      baseCommands={baseCommands}
      placeholder="Search components, guides…"
    >
      {children}
    </CommandPaletteProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SagtechUIProvider
      defaultTheme="dark"
      themeTarget="html"
      imageComponent={ImageAdapter}
      linkComponent={LinkAdapter}
    >
      <PaletteProvider>{children}</PaletteProvider>
    </SagtechUIProvider>
  );
}
