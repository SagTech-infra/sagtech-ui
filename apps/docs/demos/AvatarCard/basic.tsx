'use client';
import { AvatarCard } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-24px">
      <AvatarCard name="Alice" info="CTO">
        <div className="flex h-full w-full items-center justify-center bg-pr_purple text-[48px] text-white">
          A
        </div>
      </AvatarCard>
      <AvatarCard name="Bob" info="Lead Engineer">
        <div className="flex h-full w-full items-center justify-center bg-sec_purple text-[48px] text-white">
          B
        </div>
      </AvatarCard>
    </div>
  );
}
