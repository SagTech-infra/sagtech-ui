'use client';
import { AnimationButton } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <AnimationButton text="View Project" />
      <AnimationButton text="Explore case study" />
    </div>
  );
}
