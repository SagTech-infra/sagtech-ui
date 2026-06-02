// No 'use client' directive here: this core is reached only via React.lazy()
// from the client wrapper (Scene3D.tsx), which owns the client boundary.
// Keeping the directive off the split chunk avoids esbuild's "directive ignored"
// build warning.
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as tokens from '@/tokens/tokens';
import type { Scene3DProps } from './Scene3D';

/**
 * Heavy core for {@link Scene3D}. Imported lazily by the wrapper so the
 * `@react-three/fiber` / `@react-three/drei` / `three` peers are split into an
 * async chunk and stay out of the consumer's initial bundle.
 */
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

export default function Scene3DCore({
  children,
  camera,
  controls = 'orbit',
  background = tokens.colors.black_1,
  lighting = 'default',
}: Scene3DProps) {
  const cameraConfig = {
    position: camera?.position ?? ([5, 5, 5] as [number, number, number]),
    fov: camera?.fov ?? 50,
  };

  return (
    <Canvas camera={cameraConfig} style={{ background }}>
      <Lighting kind={lighting} />
      {controls === 'orbit' && <OrbitControls makeDefault />}
      {children}
    </Canvas>
  );
}
