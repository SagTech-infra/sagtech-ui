'use client';
import { AvatarGroup } from '@sagtech-infra/ui';

const team = [
  { name: 'Alice Adams' },
  { name: 'Bob Brown' },
  { name: 'Carol Clark' },
  { name: 'Dan Davis' },
  { name: 'Eve Evans' },
  { name: 'Frank Ford' },
];

export default function Demo() {
  return <AvatarGroup avatars={team} max={4} label="Project team" />;
}
