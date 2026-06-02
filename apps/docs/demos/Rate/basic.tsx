'use client';
import { Rate } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-16px">
      <Rate value={5} label="AI match" />
      <Rate value={3.5} label="Candidate quality" />
      <Rate value={7} max={10} label="NPS" tone="success" />
    </div>
  );
}
