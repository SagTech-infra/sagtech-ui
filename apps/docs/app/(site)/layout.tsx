import type { ReactNode } from 'react';
import { DocsShell } from '@/components/DocsShell';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
