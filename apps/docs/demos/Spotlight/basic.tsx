'use client';
import { useRef, useState } from 'react';
import { Spotlight, Button } from '@sagtech-infra/ui';

export default function Demo() {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="p-40px flex flex-col gap-32px">
      <h2 className="font-manrope text-18 text-fg-primary">Welcome tour</h2>
      <button
        ref={ref}
        type="button"
        className="self-start px-24px py-12px rounded-8px bg-pr_purple text-white font-manrope text-14"
      >
        Click me first
      </button>
      <Button text="Open spotlight" variant="secondary" buttonSize="small" onClick={() => setOpen(true)} />
      <Spotlight
        targetRef={ref}
        open={open}
        onOpenChange={setOpen}
        title="Get started here"
        description="This button creates your first project. Click it to begin."
        placement="bottom"
      />
    </div>
  );
}
