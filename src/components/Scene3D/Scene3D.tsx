'use client';

import { lazy, Suspense, type ReactNode } from 'react';
import classNames from 'classnames';
import * as tokens from '@/tokens/tokens';

/**
 * Generic `<Canvas>` wrapper for ad-hoc 3D scenes. Backed by `@react-three/fiber`
 * + `@react-three/drei` + `three` (all optional peers — consumers who don't
 * render this component pay zero bundle bytes for them).
 *
 * The wrapper renders the sized container synchronously and lazy-loads the WebGL
 * scene behind `<Suspense>`, so importing this component does not pull the heavy
 * peers into the consumer's initial bundle.
 */
export interface Scene3DProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  controls?: 'orbit' | 'none';
  background?: string;
  lighting?: 'default' | 'studio' | 'none';
  className?: string;
  /**
   * Rendered inside the sized container while the 3D engine chunk loads (and
   * during SSR). Defaults to `null`.
   */
  loadingFallback?: ReactNode;
}

// Heavy core (@react-three/fiber + drei + three) is split into an async chunk
// and only fetched when the component mounts — see Scene3DCore.tsx.
const Scene3DCore = lazy(() => import('./Scene3DCore'));

export default function Scene3D(props: Scene3DProps) {
  // className + loadingFallback are wrapper-only; everything else flows to the core.
  const { className, loadingFallback, ...coreProps } = props;
  const {
    width = '100%',
    height = 500,
    background = tokens.colors.black_1,
  } = coreProps;

  return (
    <div
      className={classNames('sagtech-scene3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background }}
    >
      <Suspense fallback={loadingFallback ?? null}>
        <Scene3DCore {...coreProps} />
      </Suspense>
    </div>
  );
}
