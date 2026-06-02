'use client';
import { Button } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <Button text="Primary" variant="primary" buttonSize="large" />
      <Button text="Secondary" variant="secondary" buttonSize="large" />
      <Button text="Danger" variant="danger" buttonSize="large" />
      <Button text="Disabled" variant="primary" buttonSize="large" disabled />
    </div>
  );
}
