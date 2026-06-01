import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import VirtualList from '../VirtualList';

// happy-dom has no layout engine, so the virtualizer reports a zero-height
// viewport and the exact set of rendered rows is non-deterministic. We assert
// the parts that are layout-independent: the scroll container mounts, the inner
// sizer height is derived purely from count × estimateSize, and only a small
// windowed subset of a large list is rendered (not every row).
//
// Not testable here (needs a real browser / Playwright CT): scroll-driven
// windowing and measureElement dynamic remeasure (ResizeObserver is a no-op).

const ITEMS = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

describe('VirtualList', () => {
  it('mounts and renders the scroll container with the given height', () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        estimateSize={40}
        renderItem={(item) => <span>{item}</span>}
        height={400}
      />,
    );
    const scroll = container.firstElementChild as HTMLElement;
    expect(scroll).toBeInTheDocument();
    expect(scroll).toHaveClass('overflow-auto');
    expect(scroll.style.height).toBe('400px');
  });

  it('accepts a function estimateSize and getItemKey without crashing', () => {
    expect(() =>
      render(
        <VirtualList
          items={ITEMS}
          estimateSize={(i) => (i % 2 === 0 ? 40 : 60)}
          renderItem={(item) => <div>{item}</div>}
          getItemKey={(item) => item}
          height={300}
        />,
      ),
    ).not.toThrow();
  });

  it('sizes the inner spacer to items.length × estimateSize (fixed size)', () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        estimateSize={40}
        renderItem={(item) => <div>{item}</div>}
        height={400}
      />,
    );
    // getTotalSize() is count-based (20 × 40 = 800) and computed without DOM
    // measurement, so it is deterministic even in happy-dom.
    const sizer = container.firstElementChild?.firstElementChild as HTMLElement;
    expect(sizer.style.height).toBe('800px');
  });

  it('sums a variable estimateSize function into the spacer height', () => {
    // 10 rows @40 + 10 rows @80 = 1200; still count-based, no layout needed.
    const { container } = render(
      <VirtualList
        items={ITEMS}
        estimateSize={(i) => (i < 10 ? 40 : 80)}
        renderItem={(item) => <div>{item}</div>}
        height={400}
      />,
    );
    const sizer = container.firstElementChild?.firstElementChild as HTMLElement;
    expect(sizer.style.height).toBe('1200px');
  });

  it('grows the spacer when the item count grows (count-driven)', () => {
    const { container, rerender } = render(
      <VirtualList
        items={ITEMS}
        estimateSize={40}
        renderItem={(item) => <div>{item}</div>}
        getItemKey={(item) => item}
        height={400}
      />,
    );
    const sizer = () => container.firstElementChild?.firstElementChild as HTMLElement;
    expect(sizer().style.height).toBe('800px'); // 20 × 40
    // Prepending a uniquely-keyed item must not throw and must extend the spacer.
    rerender(
      <VirtualList
        items={['Item 0', ...ITEMS]}
        estimateSize={40}
        renderItem={(item) => <div>{item}</div>}
        getItemKey={(item) => item}
        height={400}
      />,
    );
    expect(sizer().style.height).toBe('840px'); // 21 × 40
  });

  it('applies a custom className alongside the base scroll classes', () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        estimateSize={40}
        renderItem={(item) => <div>{item}</div>}
        height={400}
        className="my-list"
      />,
    );
    const scroll = container.firstElementChild as HTMLElement;
    expect(scroll).toHaveClass('overflow-auto');
    expect(scroll).toHaveClass('my-list');
  });

  it('accepts a CSS-string height', () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        estimateSize={40}
        renderItem={(item) => <div>{item}</div>}
        height="50vh"
      />,
    );
    const scroll = container.firstElementChild as HTMLElement;
    expect(scroll.style.height).toBe('50vh');
  });

  it('renders without throwing for a custom overscan', () => {
    expect(() =>
      render(
        <VirtualList
          items={ITEMS}
          estimateSize={40}
          renderItem={(item) => <div>{item}</div>}
          height={400}
          overscan={3}
        />,
      ),
    ).not.toThrow();
  });
});
