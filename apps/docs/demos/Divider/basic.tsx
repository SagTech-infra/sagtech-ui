'use client';
import { Divider } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-24px w-full max-w-[480px]">
      <Divider variant="solid" />
      <Divider variant="gradient" />
      <Divider variant="dashed" />
      <Divider variant="gradient" label="OR" />
    </div>
  );
}
