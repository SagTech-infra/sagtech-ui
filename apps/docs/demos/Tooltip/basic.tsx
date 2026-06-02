'use client';
import { Tooltip } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-24px p-64px">
      <Tooltip content="Tooltip on top" position="top">
        <button
          type="button"
          className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px"
        >
          Hover me
        </button>
      </Tooltip>
      <Tooltip content="Tooltip on the right" position="right">
        <button
          type="button"
          className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px"
        >
          And me
        </button>
      </Tooltip>
    </div>
  );
}
