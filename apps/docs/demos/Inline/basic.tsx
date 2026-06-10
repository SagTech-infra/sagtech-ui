'use client';
import { Inline } from '@sagtech-infra/ui';

const Chip = ({ label }: { label: string }) => (
  <div className="bg-black_2 border border-grey_2 rounded-24px px-12px py-4px text-fg-primary font-manrope text-14">
    {label}
  </div>
);

export default function Demo() {
  return (
    <Inline gap="sm" align="center" wrap>
      <Chip label="Design" />
      <Chip label="Engineering" />
      <Chip label="Product" />
      <Chip label="Research" />
    </Inline>
  );
}
