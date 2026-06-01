'use client';

import { lazy, Suspense } from 'react';
import classNames from 'classnames';
import * as tokens from '@/tokens/tokens';
import type { Mindmap3DProps } from './types';

// Heavy core (@react-three/fiber + drei + three) is split into an async chunk
// and only fetched when the component mounts — see Mindmap3DCore.tsx.
const Mindmap3DCore = lazy(() => import('./Mindmap3DCore'));

/**
 * Hierarchical 3D mindmap backed by `@react-three/fiber` + `@react-three/drei`
 * + `three` (optional peers).
 *
 * The wrapper renders the sized container synchronously and lazy-loads the WebGL
 * scene behind `<Suspense>`, so importing this component does not pull the heavy
 * peers into the consumer's initial bundle. `loadingFallback` fills the container
 * while the chunk loads (and during SSR); defaults to `null`.
 */
export default function Mindmap3D(props: Mindmap3DProps) {
  const {
    width = 600,
    height = 500,
    backgroundColor = tokens.colors.black_1,
    className,
    loadingFallback,
  } = props;

  return (
    <div
      className={classNames('sagtech-mindmap3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background: backgroundColor }}
    >
      <Suspense fallback={loadingFallback ?? null}>
        <Mindmap3DCore {...props} />
      </Suspense>
    </div>
  );
}
