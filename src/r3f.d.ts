// Bridge @react-three/fiber v8's `ThreeElements` into React 19's
// `React.JSX.IntrinsicElements` namespace.
//
// r3f v8 augments only the legacy global `JSX.IntrinsicElements`, but React 19
// resolves intrinsic elements via `React.JSX.IntrinsicElements` (see
// `@types/react/jsx-runtime.d.ts`). Without this bridge, intrinsics like
// `<mesh>`, `<group>`, `<ambientLight>`, etc. fail to type-check inside r3f
// scenes even though they render correctly at runtime.
//
// r3f v9 fixes this upstream; remove this file when we bump the peer.
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
