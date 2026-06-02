'use client';
import { TypingAnimation } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-16px">
      <span className="font-manrope text-24 text-white_4">
        <TypingAnimation>Hello, world!</TypingAnimation>
      </span>
      <span className="font-manrope text-24 text-pr_purple">
        <TypingAnimation duration={120}>Typing slowly…</TypingAnimation>
      </span>
    </div>
  );
}
