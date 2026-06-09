import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from './_og/render';

// Render at request time. Turbopack's static-export pipeline (Next 16.2) crashes
// inside the satori font/glyph table while prerendering ImageResponse routes
// ("Cannot read properties of undefined (reading '256')"); rendering on demand
// avoids the build-time export step while serving the identical PNG.
export const dynamic = 'force-dynamic';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'SagTech UI — React component library';

export default function Image() {
  return renderOgImage({ eyebrow: 'Component library', title: 'SagTech UI' });
}
