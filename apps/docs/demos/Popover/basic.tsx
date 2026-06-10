'use client';
import { Popover } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-[80px]">
      <Popover
        position="bottom"
        align="start"
        trigger={
          <span className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px inline-block">
            Click me
          </span>
        }
      >
        <div className="flex flex-col gap-12px max-w-[260px]">
          <h4 className="text-fg-primary text-16 font-manrope font-semibold">User Profile</h4>
          <p className="text-fg-muted text-14 font-manrope">
            Senior developer with 5+ years of experience. Click outside to close.
          </p>
          <button
            type="button"
            className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px w-full"
          >
            View Profile
          </button>
        </div>
      </Popover>
    </div>
  );
}
