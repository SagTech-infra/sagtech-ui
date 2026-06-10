'use client';
import { Stack } from '@sagtech-infra/ui';

const Box = ({ label }: { label: string }) => (
  <div className="bg-black_2 border border-grey_2 rounded-8px p-12px text-fg-primary font-manrope text-14">
    {label}
  </div>
);

export default function Demo() {
  return (
    <Stack gap="md" className="w-full max-w-[480px]">
      <Box label="Item one" />
      <Box label="Item two" />
      <Box label="Item three" />
    </Stack>
  );
}
