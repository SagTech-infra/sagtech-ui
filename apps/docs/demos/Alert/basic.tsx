'use client';
import { Alert } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex w-full max-w-[520px] flex-col gap-16px">
      <Alert variant="info" title="New version available">
        We just shipped v2.4.0. Refresh to get the latest features.
      </Alert>
      <Alert variant="success" title="Changes saved">
        Your profile has been updated.
      </Alert>
      <Alert variant="warning" title="Disk space running low">
        Less than 10% of your plan quota remains.
      </Alert>
      <Alert variant="error" title="Payment failed">
        Please update your billing details and retry.
      </Alert>
    </div>
  );
}
