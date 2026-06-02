'use client';
import { ProgressBar } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-24px">
      <ProgressBar value={65} size="lg" color="purple" showLabel />
      <ProgressBar value={40} size="md" color="blue" />
      <ProgressBar value={90} size="md" color="success" showLabel />
      <ProgressBar value={25} size="sm" color="error" />
    </div>
  );
}
