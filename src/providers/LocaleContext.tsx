import { createContext, useContext } from "react";

export type Direction = "ltr" | "rtl";

export interface LocaleContextValue {
  locale: string;
  dir: Direction;
}

export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_DIR: Direction = "ltr";

export const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  dir: DEFAULT_DIR,
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
