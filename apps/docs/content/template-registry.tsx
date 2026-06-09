'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Live template components are client-only (ssr: false) so canvas charts and
// other browser-only primitives never run during SSR — mirrors demos-index.ts.
export const templateRegistry: Record<string, ComponentType> = {
  dashboard: dynamic(() => import('@/components/templates/DashboardTemplate'), { ssr: false }),
  auth: dynamic(() => import('@/components/templates/AuthTemplate'), { ssr: false }),
  settings: dynamic(() => import('@/components/templates/SettingsTemplate'), { ssr: false }),
  pricing: dynamic(() => import('@/components/templates/PricingTemplate'), { ssr: false }),
  checkout: dynamic(() => import('@/components/templates/CheckoutTemplate'), { ssr: false }),
  inbox: dynamic(() => import('@/components/templates/InboxTemplate'), { ssr: false }),
  kanban: dynamic(() => import('@/components/templates/KanbanTemplate'), { ssr: false }),
  landing: dynamic(() => import('@/components/templates/LandingTemplate'), { ssr: false }),
  blog: dynamic(() => import('@/components/templates/BlogTemplate'), { ssr: false }),
};
