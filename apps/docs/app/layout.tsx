import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SagTech UI',
  description: 'Component library documentation — built on its own components.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // data-theme="dark" is set statically to avoid a flash before the
  // ThemeProvider (inside Providers) takes over on the client.
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
