export interface Globe3DMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  /** Optional metadata pass-through. */
  [key: string]: unknown;
}

export interface Globe3DProps {
  markers: Globe3DMarker[];
  width?: number;
  height?: number;
  /** Slow auto-rotation. Defaults to true. */
  autoRotate?: boolean;
  onMarkerClick?: (marker: Globe3DMarker) => void;
  className?: string;
  /** Globe sphere radius (in three units). Default 1. */
  radius?: number;
  /** Override sphere wireframe color. */
  globeColor?: string;
  /** Background CSS color. */
  backgroundColor?: string;
}
