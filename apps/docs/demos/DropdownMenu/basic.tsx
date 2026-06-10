'use client';
import { DropdownMenu } from '@sagtech-infra/ui';

export default function Demo() {
  const trigger = (
    <div className="w-full px-20px py-12px bg-black_2 border border-black_3 rounded-16px font-manrope text-14 text-fg-muted flex items-center justify-between gap-12px hover:border-pr_purple transition-colors">
      <span>Actions</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-fg-muted shrink-0">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div className="w-full max-w-[280px]">
      <DropdownMenu
        trigger={trigger}
        items={[
          { label: 'Edit', onClick: () => {} },
          { label: 'Duplicate', onClick: () => {} },
          { label: 'Archive', disabled: true },
          { divider: true, label: '' },
          { label: 'Delete', danger: true, onClick: () => {} },
        ]}
      />
    </div>
  );
}
