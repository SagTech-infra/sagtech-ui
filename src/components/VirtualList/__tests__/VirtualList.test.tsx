import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import VirtualList from '../VirtualList';

// happy-dom has no layout engine, so the virtualizer reports a zero-height
// viewport and the set of rendered rows is non-deterministic. We therefore
// assert the parts that are layout-independent: the scroll container mounts,
// and the inner sizer height is derived purely from count × estimateSize.

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

  it('sizes the inner spacer to items.length × estimateSize', () => {
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
});
