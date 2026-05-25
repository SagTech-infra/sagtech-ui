import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// framer-motion's exit animations rely on transitionend events that
// happy-dom does not fire reliably, which leaves elements stuck in the
// DOM during tests. Swap the library for transparent pass-through
// primitives so assertions reflect the logical state, not in-flight
// animation frames.
vi.mock('framer-motion', async () => {
  const React = await import('react');
  type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

  const passthrough = (tag: keyof HTMLElementTagNameMap) => (props: AnyProps) => {
    const {
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileDrag: _wd,
      whileInView: _wi,
      layout: _l,
      layoutId: _lid,
      drag: _d,
      dragConstraints: _dc,
      onAnimationStart: _onS,
      onAnimationComplete: _onC,
      ...rest
    } = props;
    return React.createElement(tag, rest);
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) => passthrough(prop as keyof HTMLElementTagNameMap),
    },
  );

  const AnimatePresence = ({ children }: AnyProps) =>
    React.createElement(React.Fragment, null, children);

  return { motion, AnimatePresence };
});
