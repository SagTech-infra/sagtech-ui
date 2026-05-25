import type { Theme } from "./ThemeContext";

export interface ThemeScriptProps {
  storageKey?: string;
  defaultTheme?: Theme;
  target?: "html" | "body";
}

/**
 * Server-renderable inline script that applies the persisted/system theme to
 * the document BEFORE hydration, preventing a flash of the wrong theme (FOUC).
 * Place inside <head> (e.g. Next.js app/layout.tsx).
 */
export function ThemeScript({
  storageKey = "sagtech-ui-theme",
  defaultTheme = "dark",
  target = "html",
}: ThemeScriptProps) {
  const el =
    target === "body" ? "document.body" : "document.documentElement";
  const js =
    `(function(){try{` +
    `var k=${JSON.stringify(storageKey)};` +
    `var t=localStorage.getItem(k)||${JSON.stringify(defaultTheme)};` +
    `if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}` +
    `var e=${el};e.setAttribute('data-theme',t);e.style.colorScheme=t;` +
    `}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
