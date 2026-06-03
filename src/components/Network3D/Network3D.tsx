'use client';

import { lazy, Suspense, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import * as tokens from '@/tokens/tokens';
import type { Network3DProps } from './types';

// Heavy core (react-force-graph-3d) is split into an async chunk and only
// fetched when the component mounts — see Network3DCore.tsx.
const Network3DCore = lazy(() => import('./Network3DCore'));

/**
 * 3D force-directed graph backed by `react-force-graph-3d` (an optional peer).
 *
 * The wrapper renders the sized container synchronously and lazy-loads the
 * graph engine behind a `<Suspense>` boundary, so importing this component does
 * not pull the heavy peer into the consumer's initial bundle. `loadingFallback`
 * fills the container while the chunk loads (and during SSR); it defaults to
 * `null`, preserving the previous empty-until-ready behavior.
 */
export default function Network3D(props: Network3DProps) {
  // className + loadingFallback are wrapper-only; everything else flows to the core.
  const { className, loadingFallback, ...coreProps } = props;
  const {
    width = '100%',
    height = 400,
    backgroundColor = tokens.colors.black_1,
  } = coreProps;

  const containerRef = useRef<HTMLDivElement>(null);
  // ForceGraph3D requires numeric pixel dimensions. When the caller passes a
  // CSS string (e.g. '100%'), observe the container and feed actual pixels.
  const [resolvedWidth, setResolvedWidth] = useState<number | null>(
    typeof width === 'number' ? width : null,
  );
  const [resolvedHeight, setResolvedHeight] = useState<number | null>(
    typeof height === 'number' ? height : null,
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const needsWidth = typeof width !== 'number';
    const needsHeight = typeof height !== 'number';
    if (!needsWidth && !needsHeight) return;
    const ro = new ResizeObserver(([entry]) => {
      if (needsWidth) setResolvedWidth(Math.round(entry.contentRect.width));
      if (needsHeight) setResolvedHeight(Math.round(entry.contentRect.height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  const coreWidth = typeof width === 'number' ? width : resolvedWidth;
  const coreHeight = typeof height === 'number' ? height : resolvedHeight;

  // Exclude user-supplied width/height from the spread so the resolved
  // numeric values always win (ForceGraph3D requires numbers).
  const { width: _w, height: _h, ...restCoreProps } = coreProps;

  return (
    <div
      ref={containerRef}
      className={classNames('sagtech-network3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background: backgroundColor }}
    >
      <Suspense fallback={loadingFallback ?? null}>
        {coreWidth !== null && coreHeight !== null && (
          <Network3DCore {...restCoreProps} width={coreWidth} height={coreHeight} />
        )}
      </Suspense>
    </div>
  );
}
