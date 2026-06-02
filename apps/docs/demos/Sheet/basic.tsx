'use client';
import { useState } from 'react';
import { Sheet, Button } from '@sagtech-infra/ui';

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-24px">
      <Button text="Open sheet" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
      <Sheet
        open={open}
        onOpenChange={setOpen}
        side="right"
        size="md"
        title="Sheet title"
        footer={
          <>
            <Button text="Cancel" variant="secondary" buttonSize="small" onClick={() => setOpen(false)} />
            <Button text="Save" variant="primary" buttonSize="small" onClick={() => setOpen(false)} />
          </>
        }
      >
        <p className="font-manrope text-14 text-grey_4 leading-24">
          A Sheet slides in from any edge and uses the shared overlay stack, so multiple sheets can be open at once.
        </p>
      </Sheet>
    </div>
  );
}
