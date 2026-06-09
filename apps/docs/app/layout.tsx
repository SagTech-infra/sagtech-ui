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

const SITE_URL = 'https://ui.sagtech.io';
const SITE_DESCRIPTION =
  'A production React 19 + Tailwind v4 component library — 107 components, charts and 3D, dark by default.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'SagTech UI', template: '%s — SagTech UI' },
  description: SITE_DESCRIPTION,
  applicationName: 'SagTech UI',
  openGraph: {
    type: 'website',
    siteName: 'SagTech UI',
    title: 'SagTech UI',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SagTech UI',
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: 'SagTech UI', url: SITE_URL, description: SITE_DESCRIPTION },
    {
      '@type': 'SoftwareApplication',
      name: 'SagTech UI',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
  ],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
