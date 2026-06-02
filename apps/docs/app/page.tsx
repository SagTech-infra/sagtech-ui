import NextLink from 'next/link';
import { Container } from '@sagtech-infra/ui';

export default function HomePage() {
  return (
    <Container size="lg" as="main" className="py-60px">
      <p className="font-orbitron text-pr_purple text-14 tracking-widest">SAGTECH UI</p>
      <h1 className="font-orbitron text-48 mt-12px max-w-[720px]">
        A component library, documented by itself.
      </h1>
      <p className="text-white_1 text-18 mt-16px max-w-[640px]">
        107 components, dark-first, React 19 / Next. This site is built entirely on
        the components it documents — every page you see is the library running.
      </p>
      <NextLink
        href="/components/button"
        className="inline-block mt-24px text-sec_purple text-16 underline underline-offset-4"
      >
        → Button (first documented component)
      </NextLink>
    </Container>
  );
}
