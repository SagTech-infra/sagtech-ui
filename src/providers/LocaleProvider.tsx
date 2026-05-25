"use client";

import { useMemo, type ReactNode } from "react";
import {
  LocaleContext,
  DEFAULT_LOCALE,
  DEFAULT_DIR,
  type Direction,
} from "./LocaleContext";

export interface LocaleProviderProps {
  locale?: string;
  dir?: Direction;
  children: ReactNode;
}

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
