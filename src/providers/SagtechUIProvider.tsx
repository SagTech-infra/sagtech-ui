"use client";

import { useMemo } from "react";
import {
  UIComponentsContext,
  type UIComponentsContextValue,
} from "./UIComponentsContext";
import { DefaultImageShim, DefaultLinkShim } from "./defaults";
import { ThemeProvider } from "./ThemeProvider";
import { LocaleProvider } from "./LocaleProvider";
import type { SagtechUIProviderProps } from "./SagtechUIProvider.types";

export type { SagtechUIProviderProps };

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
