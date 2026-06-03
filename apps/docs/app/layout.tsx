import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Orbitron, Manrope, Roboto } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Load the brand fonts and expose them under *-src variables. globals.css maps
// the library's --font-* tokens onto these (the tokens are self-referential by
// design, expecting the consumer to provide the actual fonts).
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-orbitron-src",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-src",
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SagTech UI",
  description: "Component library documentation — built on its own components.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${orbitron.variable} ${manrope.variable} ${roboto.variable} custom-scrollbar`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
