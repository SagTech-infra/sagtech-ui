'use client';
import { Input } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-24px w-full max-w-[480px]">
      <Input label="Email address" placeholder="Enter your email" name="email" />
      <Input isError errorMessage="This field is required" placeholder="Enter your name" name="name" />
      <Input disabled placeholder="Disabled input" name="disabled" />
    </div>
  );
}
