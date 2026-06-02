'use client';

import type { ReactNode } from 'react';
import NextImage, { type ImageProps } from 'next/image';
import NextLink from 'next/link';
import { SagtechUIProvider } from '@sagtech-infra/ui';

/* Adapt next/image + next/link to the library's injection contracts so
   framework-agnostic components (Steps, InfoTabs, Point, CardWrapper, Sidebar
   links) render with real Next primitives instead of the default shims. */
function ImageAdapter(props: Record<string, unknown>) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <NextImage {...(props as unknown as ImageProps)} />;
}

function LinkAdapter({
  href,
  children,
  ...rest
}: {
  href: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
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
      {children}
    </SagtechUIProvider>
  );
}
