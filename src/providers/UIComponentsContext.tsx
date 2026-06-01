'use client';

import { createContext, useContext } from 'react';
import {
  DefaultImageShim,
  DefaultLinkShim,
  type UIComponentsContextValue,
  type UIImageComponent,
  type UILinkComponent,
} from './defaults';

export type { UIComponentsContextValue };

export const UIComponentsContext = createContext<UIComponentsContextValue>({
  imageComponent: DefaultImageShim,
  linkComponent: DefaultLinkShim,
});

export function useImageComponent(): UIImageComponent {
  return useContext(UIComponentsContext).imageComponent;
}

export function useLinkComponent(): UILinkComponent {
  return useContext(UIComponentsContext).linkComponent;
}
