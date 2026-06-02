'use client';
import { useState } from 'react';
import { BottomSheet, Button } from '@sagtech-infra/ui';

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-24px">
      <Button text="Open" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
      <BottomSheet open={open} onOpenChange={setOpen} title="Quick actions" snapPoints={[0.5]}>
        <div className="flex flex-col gap-12px pt-12px">
          <Button text="Share" variant="secondary" buttonSize="small" />
          <Button text="Save" variant="secondary" buttonSize="small" />
          <Button text="Delete" variant="danger" buttonSize="small" />
        </div>
      </BottomSheet>
    </div>
  );
}
