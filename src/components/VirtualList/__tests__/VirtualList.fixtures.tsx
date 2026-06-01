import VirtualList from '@/components/VirtualList/VirtualList';

export interface VirtualListFixtureProps {
  /** Number of items in the list. */
  count: number;
  /** Actual rendered height of each row in px (may differ from estimateSize). */
  rowHeight: number;
  /** Estimate handed to the virtualizer (drives the pre-measure window). */
  estimateSize: number;
  /** Fixed scroll-container height in px. */
  height: number;
  /** Rows rendered above/below the viewport. */
  overscan?: number;
}

/**
 * Test harness for {@link VirtualList} CT specs. Lives in its own module (not the
 * `.ct.tsx` test file) so the `renderItem` render-prop is bundled and executed
 * in the browser — passing a render-prop across Playwright's Node↔browser bridge
 * does not work. The fixture exposes only serializable number props.
 */
export function VirtualListFixture({
  count,
  rowHeight,
  estimateSize,
  height,
  overscan,
}: VirtualListFixtureProps) {
  const items = Array.from({ length: count }, (_, i) => ({ id: i, text: `Row ${i + 1}` }));
  return (
    <VirtualList
      items={items}
      getItemKey={(item) => item.id}
      height={height}
      estimateSize={estimateSize}
      overscan={overscan}
      renderItem={(item) => (
        <div data-row style={{ height: rowHeight, boxSizing: 'border-box' }}>
          {item.text}
        </div>
      )}
    />
  );
}
