// Additive subpath entry: @sagtech-infra/ui/3d
// Re-exports the 3D / WebGL components. These are also exported from the
// main entry (src/index.ts); this subpath is additive and non-breaking.

export { default as Network3D } from "../components/Network3D/Network3D";
export type {
  Network3DProps,
  Network3DNode,
  Network3DLink,
} from "../components/Network3D/types";
export { default as Globe3D } from "../components/Globe3D/Globe3D";
export type { Globe3DProps, Globe3DMarker } from "../components/Globe3D/types";
export { default as Scene3D } from "../components/Scene3D/Scene3D";
export type { Scene3DProps } from "../components/Scene3D/Scene3D";
export { default as Mindmap3D } from "../components/Mindmap3D/Mindmap3D";
export type {
  Mindmap3DProps,
  MindmapNode,
} from "../components/Mindmap3D/types";
