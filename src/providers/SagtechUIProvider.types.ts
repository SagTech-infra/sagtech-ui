import type { ReactNode } from "react";
import type { UIImageComponent, UILinkComponent } from "./defaults";
import type { Theme } from "./ThemeContext";
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
