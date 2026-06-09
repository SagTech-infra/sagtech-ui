import type { Metadata } from 'next';
import { Container, PageHeader } from '@sagtech-infra/ui';

export const metadata: Metadata = {
  title: 'Brand',
  description: 'The SagTech UI visual language — colors, gradients, greyscale, radii, shadows and typography tokens.',
  alternates: { canonical: '/brand' },
  openGraph: { title: 'Brand — SagTech UI', description: 'The SagTech UI design tokens and visual language.', url: '/brand' },
};

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="overflow-hidden rounded-12px border border-border-default">
      <div className="h-[64px]" style={{ background: hex }} />
      <div className="p-12px">
        <p className="text-14 text-fg-primary">{name}</p>
        <p className="text-12 text-grey_3">{hex}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-40px">
      <h2 className="mb-16px font-orbitron text-28">{title}</h2>
      {children}
    </section>
  );
}

const BRAND: Array<[string, string]> = [
  ['pr_purple', '#6d3ef1'],
  ['sec_purple', '#b69ff8'],
  ['pr_blue', '#292a94'],
  ['sec_blue', '#9494c9'],
];
const GREYS: Array<[string, string]> = [
  ['black_1', '#070715'], ['black_2', '#20202d'], ['black_3', '#393944'], ['black_4', '#51515b'],
  ['grey_1', '#6a6a73'], ['grey_2', '#83838a'], ['grey_3', '#9c9ca1'], ['grey_4', '#b5b5b9'],
  ['white_1', '#cdcdd0'], ['white_2', '#e6e6e8'], ['white_3', '#f3f3f3'], ['white_4', '#f8f8f8'],
];
const STATUS: Array<[string, string]> = [
  ['error', '#992d2d'], ['warning', '#c6a328'], ['success', '#58a61b'],
];
const RADII = ['8px', '12px', '16px', '24px', '40px'];
const SHADOWS: Array<[string, string]> = [
  ['glow-purple', '0 0 24px rgba(109,62,241,0.2)'],
  ['shadow-3xl', '0px 0px 16px 0px rgba(109,62,241,0.24)'],
  ['elevate-lg', '0 24px 64px rgba(0,0,0,0.5)'],
];
const FONTS: Array<[string, string, string]> = [
  ['Orbitron', 'var(--font-orbitron), sans-serif', 'display · sci-fi headings'],
  ['Manrope', 'var(--font-manrope), sans-serif', 'UI · body'],
  ['Roboto', 'var(--font-roboto), sans-serif', 'dense text'],
];

export default function BrandPage() {
  return (
    <Container size="lg" as="main" className="py-48px">
      <PageHeader
        eyebrow="Foundations"
        title="Brand"
        subtitle="The visual language behind every component — purple-forward, dark-first, geometric."
      />

      <Section title="Brand colors">
        <div className="grid grid-cols-2 gap-16px sm:grid-cols-4">
          {BRAND.map(([n, h]) => <Swatch key={n} name={n} hex={h} />)}
        </div>
      </Section>

      <Section title="Accent gradient">
        <div
          className="flex h-[120px] items-end rounded-16px p-16px font-orbitron text-white"
          style={{ background: 'linear-gradient(135deg, #6d3ef1 0%, #5b54ee 50%, #292a94 100%)' }}
        >
          --gradient-accent
        </div>
      </Section>

      <Section title="Greyscale">
        <div className="grid grid-cols-3 gap-16px sm:grid-cols-6">
          {GREYS.map(([n, h]) => <Swatch key={n} name={n} hex={h} />)}
        </div>
      </Section>

      <Section title="Status">
        <div className="grid grid-cols-3 gap-16px">
          {STATUS.map(([n, h]) => <Swatch key={n} name={n} hex={h} />)}
        </div>
      </Section>

      <Section title="Radii">
        <div className="flex flex-wrap gap-16px">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col items-center gap-6px">
              <div
                className="h-[64px] w-[64px] border border-border-strong bg-bg-tertiary"
                style={{ borderRadius: r }}
              />
              <span className="text-12 text-grey_3">{r}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadows">
        <div className="grid grid-cols-1 gap-24px sm:grid-cols-3">
          {SHADOWS.map(([n, s]) => (
            <div key={n} className="flex flex-col items-center gap-8px">
              <div className="h-[80px] w-full rounded-12px bg-bg-secondary" style={{ boxShadow: s }} />
              <span className="text-12 text-grey_3">{n}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-16px">
          {FONTS.map(([name, family, role]) => (
            <div key={name} className="rounded-12px border border-border-default p-16px">
              <p className="text-28" style={{ fontFamily: family }}>
                {name} — The quick brown fox 0123
              </p>
              <p className="mt-4px text-12 text-grey_3">{role}</p>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}
