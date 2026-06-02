'use client';
import { Banner } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-8px w-full">
      <Banner sticky={false} variant="info" title="Heads up">
        New beta features available.
      </Banner>
      <Banner sticky={false} variant="success" title="Saved">
        Your changes were saved successfully.
      </Banner>
      <Banner sticky={false} variant="warning" title="Trial ending">
        Your trial expires in 3 days.
      </Banner>
      <Banner sticky={false} variant="error" title="Connection lost">
        Reconnecting to server...
      </Banner>
    </div>
  );
}
