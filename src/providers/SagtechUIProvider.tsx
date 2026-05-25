"use client";

import { useMemo, type ReactNode } from "react";
import {
  UIComponentsContext,
  type UIComponentsContextValue,
} from "./UIComponentsContext";
import {
  DefaultImageShim,
  DefaultLinkShim,
  type UIImageComponent,
  type UILinkComponent,
} from "./defaults";
import { ThemeProvider } from "./ThemeProvider";
import type { Theme } from "./ThemeContext";
import { LocaleProvider } from "./LocaleProvider";
import type { Direction } from "./LocaleContext";

export interface SagtechUIProviderProps {
  imageComponent?: UIImageComponent;
  linkComponent?: UILinkComponent;
  /** When set, wraps children in a ThemeProvider (controlled). */
  theme?: Theme;
  /** When set, wraps children in a ThemeProvider (uncontrolled). */
  defaultTheme?: Theme;
  /** Element to receive data-theme. Default "html". */
  themeTarget?: "html" | "body";
  /** When set, wraps children in a LocaleProvider. */
  locale?: string;
  /** When set, wraps children in a LocaleProvider. */
  dir?: Direction;
  children: ReactNode;
}

export function SagtechUIProvider({
  imageComponent,
  linkComponent,
  theme,
  defaultTheme,
  themeTarget,
  locale,
  dir,
  children,
}: SagtechUIProviderProps) {
  const value = useMemo<UIComponentsContextValue>(
    () => ({
      imageComponent: imageComponent ?? DefaultImageShim,
      linkComponent: linkComponent ?? DefaultLinkShim,
    }),
    [imageComponent, linkComponent],
  );

  const inner = (
    <UIComponentsContext.Provider value={value}>
      {children}
    </UIComponentsContext.Provider>
  );

  const useLocaleWrapper = locale !== undefined || dir !== undefined;
  const withLocale = useLocaleWrapper ? (
    <LocaleProvider locale={locale} dir={dir}>
      {inner}
    </LocaleProvider>
  ) : inner;

  const useThemeWrapper = theme !== undefined || defaultTheme !== undefined;
  if (!useThemeWrapper) return withLocale;

  return (
    <ThemeProvider theme={theme} defaultTheme={defaultTheme} target={themeTarget}>
      {withLocale}
    </ThemeProvider>
  );
}
