'use client';

import { useRef } from 'react';
import classNames from 'classnames';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualListProps<T> {
  items: T[];
  /** Fixed or dynamic row height. When a function, called per-index. */
  estimateSize: number | ((index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  /** Number of rows rendered above/below the viewport. Defaults to 5. */
  overscan?: number;
  /** Fixed viewport height in px or CSS string. Required — virtualization needs a scroll-container. */
  height: number | string;
  className?: string;
}

export default function VirtualList<T>({
  items,
  estimateSize,
  renderItem,
  getItemKey,
  overscan = 5,
  height,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: typeof estimateSize === 'function' ? estimateSize : () => estimateSize,
    overscan,
    getItemKey: getItemKey ? (i) => getItemKey(items[i], i) : undefined,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={classNames('overflow-y-auto overflow-x-hidden custom-scrollbar', className)}
      style={{ height }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
          width: '100%',
        }}
      >
        {virtualItems.map((vi) => {
          const item = items[vi.index];
          return (
            <div
              key={vi.key}
              ref={virtualizer.measureElement}
              data-index={vi.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vi.start}px)`,
              }}
            >
              {renderItem(item, vi.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
