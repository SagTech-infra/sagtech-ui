import type { Metadata } from 'next';
import ChartsGallery from './ChartsGallery';

export const metadata: Metadata = {
  title: 'Charts',
  description: 'Canvas-rendered, theme-aware charts — area, bar, line, donut, radar, gauge and more.',
  alternates: { canonical: '/charts' },
  openGraph: {
    title: 'Charts — SagTech UI',
    description: 'Canvas-rendered, theme-aware charts from the SagTech UI library.',
    url: '/charts',
  },
};

export default function ChartsPage() {
  return <ChartsGallery />;
}
