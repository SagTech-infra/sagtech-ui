'use client';
import { Toaster, toast } from '@sagtech-infra/ui';
import { Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-wrap items-center gap-12px">
        <Button text="default" buttonSize="small" variant="secondary" onClick={() => toast('Saved')} />
        <Button text="success" buttonSize="small" variant="secondary" onClick={() => toast.success('Saved successfully')} />
        <Button text="error" buttonSize="small" variant="secondary" onClick={() => toast.error('Something went wrong', { description: 'Check the console for details.' })} />
        <Button text="warning" buttonSize="small" variant="secondary" onClick={() => toast.warning('Disk almost full')} />
        <Button text="info" buttonSize="small" variant="secondary" onClick={() => toast.info('New version available')} />
      </div>
    </>
  );
}
