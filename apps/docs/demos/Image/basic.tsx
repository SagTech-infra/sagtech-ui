'use client';
import { Image } from '@sagtech-infra/ui';

// Branded gradient placeholder — reads as an intentional image on both the
// light and dark theme (the old flat #20202D fill looked dark-only on light).
const placeholderSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236D3EF1'/%3E%3Cstop offset='1' stop-color='%233B82F6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='20'%3E400 × 300%3C/text%3E%3C/svg%3E";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-start gap-24px">
      <Image
        url={placeholderSvg}
        alt="Placeholder image"
        className="relative w-[300px] h-[225px]"
        objectFit="cover"
      />
      <Image
        url={placeholderSvg}
        alt="Rounded image"
        className="relative w-[225px] h-[225px]"
        rounded="24px"
        objectFit="cover"
      />
    </div>
  );
}
