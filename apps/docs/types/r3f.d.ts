import type { ThreeElements } from '@react-three/fiber';

// @react-three/fiber augments JSX intrinsics globally for components that render
// inside its <Canvas> (e.g. Scene3D). The docs app only imports Scene3D from the
// package, so pull those element types in explicitly to type-check raw
// <mesh>/<boxGeometry>/<meshStandardMaterial> in Scene3D demos.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}
