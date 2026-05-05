'use client';

import { type ReactNode } from 'react';
import classNames from 'classnames';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as tokens from '@/tokens/tokens';

/**
 * Generic `<Canvas>` wrapper for ad-hoc 3D scenes. Backed by `@react-three/fiber`
 * + `@react-three/drei` + `three` (all optional peers — consumers who don't
 * render this component pay zero bundle bytes for them).
 */
export interface Scene3DProps {
  children?: ReactNode;
  width?: number;
  height?: number;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  controls?: 'orbit' | 'none';
  background?: string;
  lighting?: 'default' | 'studio' | 'none';
  className?: string;
}

function Lighting({ kind }: { kind: 'default' | 'studio' | 'none' }) {
  if (kind === 'none') return null;
  if (kind === 'studio') {
    return (
      <>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
        <directionalLight position={[-5, 4, -5]} intensity={0.6} />
        <pointLight position={[0, -3, 3]} intensity={0.4} color={tokens.colors.sec_purple} />
      </>
    );
  }
  // default
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
    </>
  );
}

export default function Scene3D({
  children,
  width = 500,
  height = 500,
  camera,
  controls = 'orbit',
  background = tokens.colors.black_1,
  lighting = 'default',
  className,
}: Scene3DProps) {
  const cameraConfig = {
    position: camera?.position ?? ([5, 5, 5] as [number, number, number]),
    fov: camera?.fov ?? 50,
  };

  return (
    <div
      className={classNames('sagtech-scene3d rounded-16px overflow-hidden', className)}
      style={{ width, height, background }}
    >
      <Canvas camera={cameraConfig} style={{ background }}>
        <Lighting kind={lighting} />
        {controls === 'orbit' && <OrbitControls makeDefault />}
        {children}
      </Canvas>
    </div>
  );
}
