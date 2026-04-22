'use client';

import { useMemo, type ReactNode } from 'react';
import {
  UIComponentsContext,
  type UIComponentsContextValue,
} from './UIComponentsContext';
import {
  DefaultImageShim,
  DefaultLinkShim,
  type UIImageComponent,
  type UILinkComponent,
} from './defaults';

export interface SagtechUIProviderProps {
  imageComponent?: UIImageComponent;
  linkComponent?: UILinkComponent;
  children: ReactNode;
}

export function SagtechUIProvider({
  imageComponent,
  linkComponent,
  children,
}: SagtechUIProviderProps) {
  const value = useMemo<UIComponentsContextValue>(
    () => ({
      imageComponent: imageComponent ?? DefaultImageShim,
      linkComponent: linkComponent ?? DefaultLinkShim,
    }),
    [imageComponent, linkComponent],
  );

  return (
    <UIComponentsContext.Provider value={value}>
      {children}
    </UIComponentsContext.Provider>
  );
}
