'use client';
import { Avatar } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="User avatar" size="lg" />
      <Avatar name="John Doe" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=5" size="lg" status="online" />
      <Avatar size="lg" />
    </div>
  );
}
