// Single source of truth for the full-page template gallery. Drives the
// /templates index, the sidebar nav group, the command palette, and static
// param generation for /templates/[slug]. Each template's live component lives
// in components/templates/<file> and is read back as source for the Code view.

export type TemplateKind = 'App' | 'Marketing';

export interface TemplateEntry {
  name: string;
  slug: string;
  description: string;
  kind: TemplateKind;
  /** File under components/templates/ — used for fs source read + dynamic import. */
  file: string;
}

export const templates: TemplateEntry[] = [
  {
    name: 'Dashboard',
    slug: 'dashboard',
    description: 'Analytics dashboard — KPI stats, charts and a sortable data table.',
    kind: 'App',
    file: 'DashboardTemplate.tsx',
  },
  {
    name: 'Auth',
    slug: 'auth',
    description: 'Login / sign-up screen built with the Form primitives.',
    kind: 'App',
    file: 'AuthTemplate.tsx',
  },
  {
    name: 'Settings',
    slug: 'settings',
    description: 'Account settings with tabbed sections, toggles and forms.',
    kind: 'App',
    file: 'SettingsTemplate.tsx',
  },
  {
    name: 'Pricing',
    slug: 'pricing',
    description: 'Pricing page with plan cards, a billing toggle and an FAQ.',
    kind: 'App',
    file: 'PricingTemplate.tsx',
  },
  {
    name: 'Landing',
    slug: 'landing',
    description: 'Marketing landing page composed from the marketing blocks.',
    kind: 'Marketing',
    file: 'LandingTemplate.tsx',
  },
];

export const getTemplate = (slug: string): TemplateEntry | undefined =>
  templates.find((t) => t.slug === slug);
