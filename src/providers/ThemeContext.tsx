import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const DEFAULT_STORAGE_KEY = "sagtech-ui-theme";

export interface ThemeProviderProps {
  /** Controlled theme. When set, persistence is disabled and the prop wins. */
  theme?: Theme;
  /** Uncontrolled initial theme. Default "dark". */
  defaultTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** Element to receive data-theme + colorScheme. Default "html". */
  target?: "html" | "body";
  storageKey?: string;
  /** When false, "system" falls back to "dark". Default true. */
  enableSystem?: boolean;
  children: ReactNode;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export interface ThemeContextValue {
  /** The selected theme; stays "system" when system mode is active. */
  theme: Theme;
  /** The effective theme after resolving "system" via matchMedia. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
