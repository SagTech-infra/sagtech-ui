'use client';
import { EmptyState, Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <EmptyState
        title="No items yet"
        description="Get started by creating your first item."
        action={<Button text="Add Item" variant="primary" buttonSize="small" />}
      />
    </div>
  );
}
