import type { MetadataRoute } from 'next';
import { components } from '@/content/registry';
import { guides } from '@/content/guides';
import { templates } from '@/content/templates';

const BASE = 'https://ui.sagtech.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/overview', '/brand', '/charts', '/templates'];
  return [
    ...staticRoutes.map((p) => ({ url: `${BASE}${p}`, lastModified: now })),
    ...components.map((c) => ({ url: `${BASE}/components/${c.slug}`, lastModified: now })),
    ...guides.map((g) => ({ url: `${BASE}/guides/${g.slug}`, lastModified: now })),
    ...templates.map((t) => ({ url: `${BASE}/templates/${t.slug}`, lastModified: now })),
  ];
}
