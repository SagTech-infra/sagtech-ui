'use client';
import { SectionTag } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <SectionTag size="small">Small</SectionTag>
      <SectionTag size="middle">Middle</SectionTag>
      <SectionTag size="large">Large</SectionTag>
    </div>
  );
}
