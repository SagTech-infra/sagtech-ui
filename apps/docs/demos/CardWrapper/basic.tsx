'use client';
import { CardWrapper } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-24px w-full max-w-[400px]">
      <CardWrapper rounded="24" stoke="2">
        <div className="p-24px text-fg-primary font-manrope">
          <h3 className="text-16 font-bold">Card Content</h3>
          <p className="text-fg-muted text-14">Rounded 24, stroke 2 gradient border</p>
        </div>
      </CardWrapper>
      <CardWrapper rounded="16" stoke="1">
        <div className="p-24px text-fg-primary font-manrope">
          <h3 className="text-16 font-bold">Thinner border</h3>
          <p className="text-fg-muted text-14">Rounded 16, stroke 1</p>
        </div>
      </CardWrapper>
    </div>
  );
}
