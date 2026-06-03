'use client';

import { lazy, Suspense } from 'react';
import classNames from 'classnames';
import * as tokens from '@/tokens/tokens';
import type { Globe3DProps } from './types';

// Heavy core (@react-three/fiber + drei + three) is split into an async chunk
// and only fetched when the component mounts — see Globe3DCore.tsx.
const Globe3DCore = lazy(() => import('./Globe3DCore'));

/**
 * Stylised 3D globe with raised markers, backed by `@react-three/fiber` +
 * `@react-three/drei` + `three` (optional peers).
 *
 * The wrapper renders the sized container synchronously and lazy-loads the WebGL
 * scene behind `<Suspense>`, so importing this component does not pull the heavy
 * peers into the consumer's initial bundle. `loadingFallback` fills the container
 * while the chunk loads (and during SSR); defaults to `null`.
 */
export default function Globe3D(props: Globe3DProps) {
  // className + loadingFallback are wrapper-only; everything else flows to the core.
  const { className, loadingFallback, ...coreProps } = props;
  const {
    width = '100%',
    height = 500,
    backgroundColor = tokens.colors.black_1,
  } = coreProps;

  return (
    <div
      className={classNames('sagtech-globe3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background: backgroundColor }}
    >
      <Suspense fallback={loadingFallback ?? null}>
        <Globe3DCore {...coreProps} />
      </Suspense>
    </div>
  );
}
