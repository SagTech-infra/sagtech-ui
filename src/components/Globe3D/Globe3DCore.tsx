// No 'use client' directive here: this core is reached only via React.lazy()
// from the client wrapper (Globe3D.tsx), which owns the client boundary.
// Keeping the directive off the split chunk avoids esbuild's "directive ignored"
// build warning.
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Html } from '@react-three/drei';
import * as tokens from '@/tokens/tokens';
import type { Globe3DProps, Globe3DMarker } from './types';

/**
 * Heavy core for {@link Globe3D}. Imported lazily by the wrapper so the
 * `@react-three/fiber` / `@react-three/drei` / `three` peers are split into an
 * async chunk and stay out of the consumer's initial bundle.
 */
function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  // Standard sphere coords: lat is +90..-90 (north pole = +y),
  // lng is -180..+180 (Greenwich = +x).
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

interface SceneProps {
  markers: Globe3DMarker[];
  autoRotate: boolean;
  onMarkerClick?: (m: Globe3DMarker) => void;
  radius: number;
  globeColor: string;
}

function GlobeScene({ markers, autoRotate, onMarkerClick, radius, globeColor }: SceneProps) {
  const markerPositions = useMemo(
    () =>
      markers.map((m) => ({
        marker: m,
        position: latLngToVec3(m.lat, m.lng, radius * 1.02),
      })),
    [markers, radius],
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <Stars radius={50} depth={50} count={2000} factor={2} fade speed={0.5} />
      {/* Wireframe globe */}
      <Sphere args={[radius, 32, 32]}>
        <meshBasicMaterial color={globeColor} wireframe transparent opacity={0.35} />
      </Sphere>
      {/* Subtle solid sphere for depth */}
      <Sphere args={[radius * 0.99, 32, 32]}>
        <meshStandardMaterial color={tokens.colors.black_2} roughness={0.8} metalness={0.2} />
      </Sphere>
      {markerPositions.map(({ marker, position }, i) => (
        <group key={i} position={position}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick?.(marker);
            }}
          >
            <sphereGeometry args={[radius * 0.04, 16, 16]} />
            <meshStandardMaterial
              color={marker.color ?? tokens.colors.pr_purple}
              emissive={marker.color ?? tokens.colors.pr_purple}
              emissiveIntensity={0.6}
            />
          </mesh>
          {marker.label && (
            <Html distanceFactor={6} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: 11,
                  color: tokens.colors.white_4,
                  background: 'rgba(7, 7, 21, 0.85)',
                  padding: '2px 6px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  transform: 'translate(8px, -50%)',
                }}
              >
                {marker.label}
              </div>
            </Html>
          )}
        </group>
      ))}
      <OrbitControls enablePan={false} autoRotate={autoRotate} autoRotateSpeed={0.6} />
    </>
  );
}

export default function Globe3DCore({
  markers,
  autoRotate = true,
  onMarkerClick,
  radius = 1,
  globeColor = tokens.colors.pr_purple,
  backgroundColor = tokens.colors.black_1,
}: Globe3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} style={{ background: backgroundColor }}>
      <GlobeScene
        markers={markers}
        autoRotate={autoRotate}
        onMarkerClick={onMarkerClick}
        radius={radius}
        globeColor={globeColor}
      />
    </Canvas>
  );
}
