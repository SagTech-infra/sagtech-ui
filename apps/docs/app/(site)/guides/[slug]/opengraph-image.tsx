import { getGuide } from '@/content/guides';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/_og/render';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'SagTech UI guide';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return renderOgImage({ eyebrow: 'Guide', title: guide?.title ?? 'Guide' });
}
