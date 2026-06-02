'use client';
import { Network3D } from '@sagtech-infra/ui/3d';

const nodes = [
  { id: 'a', label: 'Alpha', group: 1 },
  { id: 'b', label: 'Beta', group: 1 },
  { id: 'c', label: 'Gamma', group: 2 },
  { id: 'd', label: 'Delta', group: 2 },
  { id: 'e', label: 'Epsilon', group: 3 },
  { id: 'f', label: 'Zeta', group: 3 },
];

const links = [
  { source: 'a', target: 'b', value: 1 },
  { source: 'a', target: 'c', value: 2 },
  { source: 'b', target: 'd', value: 1 },
  { source: 'c', target: 'd', value: 1 },
  { source: 'c', target: 'e', value: 3 },
  { source: 'd', target: 'f', value: 1 },
  { source: 'e', target: 'f', value: 2 },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[600px]">
      <Network3D nodes={nodes} links={links} width={600} height={400} />
    </div>
  );
}
