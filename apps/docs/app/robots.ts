import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://ui.sagtech.io/sitemap.xml',
    host: 'https://ui.sagtech.io',
  };
}
