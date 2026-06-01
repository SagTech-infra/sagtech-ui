"use client";

import { useMemo } from "react";
import {
  LocaleContext,
  DEFAULT_LOCALE,
  DEFAULT_DIR,
  type LocaleProviderProps,
} from "./LocaleContext";

export type { LocaleProviderProps };

export function LocaleProvider({
  locale = DEFAULT_LOCALE,
  dir = DEFAULT_DIR,
  children,
}: LocaleProviderProps) {
  const value = useMemo(() => ({ locale, dir }), [locale, dir]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
