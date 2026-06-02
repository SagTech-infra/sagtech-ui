'use client';
import { useState } from 'react';
import { Modal, Button } from '@sagtech-infra/ui';

export default function Demo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <Button text="Open modal" variant="primary" buttonSize="small" onClick={() => setIsOpen(true)} />
      <Modal
        isOpen={isOpen}
        toggle={() => setIsOpen(false)}
        title="Delete campaign"
        footer={
          <>
            <Button text="Cancel" variant="secondary" buttonSize="small" onClick={() => setIsOpen(false)} />
            <Button text="Delete" variant="danger" buttonSize="small" onClick={() => setIsOpen(false)} />
          </>
        }
      >
        <p className="font-manrope text-14 text-grey_4">
          This action is irreversible. The campaign and all associated leads will be removed.
        </p>
      </Modal>
    </div>
  );
}
