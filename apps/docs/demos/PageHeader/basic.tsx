'use client';
import { PageHeader } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full max-w-[640px]">
      <PageHeader
        eyebrow="Settings"
        title="Members"
        subtitle="Manage who can access your organisation."
        actions={
          <button className="bg-pr_purple text-white_4 font-manrope text-14 font-semibold px-16px py-8px rounded-8px">
            Invite member
          </button>
        }
      />
    </div>
  );
}
