import NextLink from 'next/link';
import { Container } from '@sagtech-infra/ui';

const CARDS = [
  {
    href: '/components/button',
    title: 'Components',
    body: '107 components — foundations, forms, layout, data display.',
  },
  { href: '/charts', title: 'Charts', body: '12 canvas, theme-aware chart types.' },
  { href: '/three', title: '3D', body: 'WebGL scenes: network graphs, globe, mindmaps.' },
  { href: '/brand', title: 'Brand', body: 'Colors, gradients, typography, shadows.' },
  { href: '/guides/theming', title: 'Guides', body: 'Theming, motion, i18n, migration.' },
];

export default function HomePage() {
  return (
    <main>
      <Container size="lg" className="py-72px">
        <p className="font-orbitron text-14 tracking-widest text-pr_purple">SAGTECH UI</p>
        <h1 className="mt-12px max-w-[820px] font-orbitron text-64 leading-64">
          A component library, documented by itself.
        </h1>
        <p className="mt-16px max-w-[640px] text-18 text-white_1">
          107 components, dark-first, React 19 / Next. Every page of this site is the
          library running — it is its own showcase.
        </p>

        <div className="mt-40px grid grid-cols-1 gap-16px sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <NextLink
              key={c.href}
              href={c.href}
              className="block rounded-16px border border-border-default p-24px transition-colors hover:border-border-strong"
            >
              <p className="font-orbitron text-18 text-fg-primary">{c.title}</p>
              <p className="mt-8px text-14 text-grey_3">{c.body}</p>
            </NextLink>
          ))}
        </div>
      </Container>
    </main>
  );
}
