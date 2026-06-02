'use client';
import { useState } from 'react';
import { ConfirmDialog } from '@sagtech-infra/ui';

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('—');
  return (
    <div className="flex flex-col gap-16px">
      <button
        type="button"
        className="self-start rounded-12px bg-pr_purple px-16px py-8px text-white font-manrope"
        onClick={() => setOpen(true)}
      >
        Delete file
      </button>
      <span className="text-grey_4 text-14 font-manrope">Result: {result}</span>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this file?"
        description="This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          setResult('confirmed');
          setOpen(false);
        }}
      />
    </div>
  );
}
