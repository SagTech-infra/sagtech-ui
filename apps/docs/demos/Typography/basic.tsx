'use client';
import { Typography } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-16px">
      <Typography tag="h1" color="text-white_4">H1 — Orbitron Bold</Typography>
      <Typography tag="h3" color="text-white_4">H3 — Manrope Bold</Typography>
      <Typography type="BodyL" color="text-white_1">BodyL — Manrope Medium</Typography>
      <Typography type="BodyM" color="text-grey_4">BodyM — Manrope Medium</Typography>
      <Typography type="Labels" color="text-white_4">Labels — Manrope Semibold</Typography>
      <Typography type="MetricsXL" color="text-pr_purple">150+</Typography>
      <Typography type="Info" color="text-grey_2">Info — caption text</Typography>
    </div>
  );
}
