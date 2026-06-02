import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// The global framer-motion mock in vitest.setup.ts omits useMotionValue.
// BottomSheet calls useMotionValue(0) for its drag-y spring, so we extend
// the global mock here to add a no-op shim.
vi.mock('framer-motion', async (importOriginal) => {
  const original = await importOriginal<typeof import('framer-motion')>();
  const React = await import('react');
  type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

  const passthrough =
    (tag: keyof HTMLElementTagNameMap) => (props: AnyProps) => {
      const {
        initial: _i, animate: _a, exit: _e, transition: _t, variants: _v,
        whileHover: _wh, whileTap: _wt, whileFocus: _wf, whileDrag: _wd,
        whileInView: _wi, layout: _l, layoutId: _lid,
        drag: _d, dragConstraints: _dc, dragElastic: _de,
        onDragEnd: _ode,
        onAnimationStart: _onS, onAnimationComplete: _onC,
        style: _style,
        ...rest
      } = props;
      return React.createElement(tag, rest);
    };

  const motion = new Proxy({} as Record<string, unknown>, {
    get: (_target, prop: string) =>
      passthrough(prop as keyof HTMLElementTagNameMap),
  });

  const AnimatePresence = ({ children }: AnyProps) =>
    React.createElement(React.Fragment, null, children);

  const useReducedMotion = () => false;
  const useMotionValue = (initial: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = React.useRef(initial);
    return { get: () => ref.current, set: (v: number) => { ref.current = v; } };
  };

  return { ...original, motion, AnimatePresence, useReducedMotion, useMotionValue };
});

import { BottomSheet } from '../BottomSheet';

describe('BottomSheet — smoke tests', () => {
  it('renders dialog content when open=true', () => {
    render(
      <BottomSheet open onOpenChange={vi.fn()} aria-label="Test bottom sheet">
        <p>Bottom sheet body</p>
      </BottomSheet>,
    );
    expect(screen.getByText('Bottom sheet body')).toBeInTheDocument();
  });

  it('renders with role="dialog"', () => {
    render(
      <BottomSheet open onOpenChange={vi.fn()} aria-label="Test bottom sheet">
        Content
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the title when provided', () => {
    render(
      <BottomSheet open onOpenChange={vi.fn()} title="My Bottom Sheet">
        Content
      </BottomSheet>,
    );
    expect(screen.getByText('My Bottom Sheet')).toBeInTheDocument();
  });

  it('uses aria-label from prop when no title provided', () => {
    render(
      <BottomSheet open onOpenChange={vi.fn()} aria-label="Custom label">
        Content
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Custom label' })).toBeInTheDocument();
  });

  it('does not render content when open=false', () => {
    render(
      <BottomSheet open={false} onOpenChange={vi.fn()} aria-label="Hidden sheet">
        <p>Hidden content</p>
      </BottomSheet>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
});
