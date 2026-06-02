'use client';
import { Scene3D } from '@sagtech-infra/ui/3d';

export default function Demo() {
  return (
    <div className="w-full max-w-[500px]">
      <Scene3D width={500} height={500} lighting="studio" controls="orbit">
        <mesh rotation={[0.4, 0.6, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </mesh>
      </Scene3D>
    </div>
  );
}
