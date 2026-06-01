'use client';

import { lazy, Suspense } from 'react';
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
    width = 600,
    height = 400,
    backgroundColor = tokens.colors.black_1,
  } = coreProps;

  return (
    <div
      className={classNames('sagtech-network3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background: backgroundColor }}
    >
      <Suspense fallback={loadingFallback ?? null}>
        <Network3DCore {...coreProps} />
      </Suspense>
    </div>
  );
}
