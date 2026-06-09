import { getTemplate } from '@/content/templates';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/_og/render';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'SagTech UI template';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getTemplate(slug);
  return renderOgImage({ eyebrow: `${entry?.kind ?? ''} template`.trim(), title: entry?.name ?? 'Template' });
}
