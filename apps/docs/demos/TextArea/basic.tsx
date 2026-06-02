'use client';
import { TextArea } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-24px w-full max-w-[480px]">
      <TextArea placeholder="Enter your message..." rows={4} />
      <TextArea isError errorMessage="Message is required" placeholder="Enter your message..." rows={4} />
    </div>
  );
}
