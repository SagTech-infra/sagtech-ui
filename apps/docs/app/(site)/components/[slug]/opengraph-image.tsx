import { getComponent } from '@/content/registry';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/_og/render';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'SagTech UI component';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getComponent(slug);
  return renderOgImage({ eyebrow: entry?.category ?? 'Component', title: entry?.name ?? 'SagTech UI' });
}
