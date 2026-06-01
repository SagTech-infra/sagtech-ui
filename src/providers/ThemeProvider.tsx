"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeContext,
  DEFAULT_STORAGE_KEY,
  type Theme,
  type ResolvedTheme,
  type ThemeProviderProps,
} from "./ThemeContext";

export type { ThemeProviderProps };

export function ThemeProvider({
  theme: controlledTheme,
  defaultTheme = "dark",
  onThemeChange,
  target = "html",
  storageKey = DEFAULT_STORAGE_KEY,
  enableSystem = true,
  children,
}: ThemeProviderProps) {
  const isControlled = controlledTheme !== undefined;
  const [uncontrolledTheme, setUncontrolledTheme] =
    useState<Theme>(defaultTheme);
  const theme = isControlled ? (controlledTheme as Theme) : uncontrolledTheme;
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === "system" ? "dark" : (theme as ResolvedTheme),
  );

  // Hydrate from storage (uncontrolled only), client-only.
  useEffect(() => {
    if (isControlled || typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light" || stored === "system") {
      setUncontrolledTheme(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolve theme + subscribe to system changes.
  useEffect(() => {
    const effective: Theme =
      !enableSystem && theme === "system" ? "dark" : theme;
    if (effective === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const update = () => setResolvedTheme(mql.matches ? "dark" : "light");
      update();
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    setResolvedTheme(effective as ResolvedTheme);
  }, [theme, enableSystem]);

  // Apply to DOM.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el =
      target === "body" ? document.body : document.documentElement;
    el.setAttribute("data-theme", resolvedTheme);
    el.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, target]);

  const setTheme = useCallback(
    (next: Theme) => {
      if (!isControlled) {
        setUncontrolledTheme(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, next);
        }
      }
      onThemeChange?.(next);
    },
    [isControlled, onThemeChange, storageKey],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

