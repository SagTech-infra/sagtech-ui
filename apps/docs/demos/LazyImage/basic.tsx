'use client';
import { LazyImage } from '@sagtech-infra/ui';

const placeholderSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%2320202D'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236D3EF1' font-family='sans-serif' font-size='20'%3E400 × 300%3C/text%3E%3C/svg%3E";

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <LazyImage
        url={placeholderSvg}
        alt="Lazy loaded image"
        className="relative w-[400px] h-[300px]"
        objectFit="cover"
      />
    </div>
  );
}
