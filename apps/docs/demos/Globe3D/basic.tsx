'use client';
import { Globe3D } from '@sagtech-infra/ui/3d';

const markers = [
  { lat: 40.7128, lng: -74.006, label: 'New York' },
  { lat: 51.5074, lng: -0.1278, label: 'London' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  { lat: -33.8688, lng: 151.2093, label: 'Sydney' },
  { lat: 55.7558, lng: 37.6173, label: 'Moscow' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[500px]">
      <Globe3D markers={markers} width={500} height={500} autoRotate />
    </div>
  );
}
