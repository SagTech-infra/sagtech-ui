'use client';
import { Carousel } from '@sagtech-infra/ui';

const slideCls =
  'flex items-center justify-center h-[200px] rounded-16px font-orbitron text-24 text-fg-primary';
const colors = ['bg-pr_purple', 'bg-pr_blue', 'bg-sec_purple', 'bg-sec_blue'];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <Carousel ariaLabel="Featured items">
        {colors.map((color, i) => (
          <div key={i} className={`${slideCls} ${color}`}>
            Slide {i + 1}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
