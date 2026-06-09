import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// Shared renderer for every opengraph-image route. `_og` is a private folder
// (underscore prefix) so it never becomes a route itself.
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

// Load the bundled Orbitron TTF from disk. `next build` runs from apps/docs, so
// cwd === apps/docs at build time; `outputFileTracingIncludes` in next.config.ts
// keeps `app/_og/**` (the font) in the standalone bundle so this path resolves
// at runtime too. (Turbopack's static export cannot fetch() a file: URL, so we
// read the file directly instead of via fetch(import.meta.url).)
let fontPromise: Promise<ArrayBuffer> | null = null;
const loadFont = () => {
  // Use a STATIC Orbitron instance (woff, weight 600) — satori cannot parse the
  // variable `Orbitron[wght].ttf` and crashes with "Cannot read properties of
  // undefined (reading '256')". Return a clean ArrayBuffer copy (sliced to the
  // exact byteOffset/length) so satori reads the font tables correctly.
  fontPromise ??= readFile(join(process.cwd(), 'app', '_og', 'Orbitron.woff')).then(
    (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
  );
  return fontPromise;
};

export async function renderOgImage({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#070713',
          backgroundImage:
            'radial-gradient(1000px circle at 82% 8%, rgba(109,62,241,0.55), transparent 55%)',
          fontFamily: 'Orbitron',
          color: '#f8f8f8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 36, letterSpacing: 1 }}>
          <span>SagTech</span>
          <span style={{ color: '#b69ff8', marginLeft: 12 }}>UI</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eyebrow ? (
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                letterSpacing: 6,
                color: '#b69ff8',
                marginBottom: 18,
              }}
            >
              {eyebrow.toUpperCase()}
            </div>
          ) : null}
          <div style={{ display: 'flex', fontSize: 108, lineHeight: 1.04, fontWeight: 600 }}>
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 28, color: '#83838a' }}>ui.sagtech.io</div>
      </div>
    ),
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      fonts: [{ name: 'Orbitron', data: font, weight: 600, style: 'normal' }],
    },
  );
}
