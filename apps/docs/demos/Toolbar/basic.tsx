'use client';
import { Toolbar } from '@sagtech-infra/ui';

const Btn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...props}
    className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-[6px] text-grey_4 hover:bg-black_3 hover:text-white_4 cursor-pointer transition-colors"
  >
    {children}
  </button>
);

export default function Demo() {
  return (
    <Toolbar ariaLabel="Text formatting">
      <Btn aria-label="Bold">B</Btn>
      <Btn aria-label="Italic">I</Btn>
      <Btn aria-label="Underline">U</Btn>
      <Toolbar.Separator />
      <Btn aria-label="Align left">L</Btn>
      <Btn aria-label="Align center">C</Btn>
    </Toolbar>
  );
}
