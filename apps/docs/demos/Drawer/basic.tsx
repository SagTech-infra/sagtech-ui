'use client';
import { useState } from 'react';
import { Drawer, Button } from '@sagtech-infra/ui';

export default function Demo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <Button text="Open Drawer" variant="primary" buttonSize="large" onClick={() => setIsOpen(true)} />
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Drawer Title">
        <div className="flex flex-col gap-16px">
          <p className="font-manrope text-14 text-fg-muted leading-24">
            This panel slides in from the side. Close it with the X button, the Escape key, or by
            clicking the overlay.
          </p>
          <Button text="Close" variant="secondary" buttonSize="small" onClick={() => setIsOpen(false)} />
        </div>
      </Drawer>
    </div>
  );
}
