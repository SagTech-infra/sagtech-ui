'use client';

import type React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
  if (typeof document === 'undefined') return null;
  const portalRoot = document.getElementById('portal-root')!;
  if (!portalRoot) return null;
  return ReactDOM.createPortal(children, portalRoot);
}
