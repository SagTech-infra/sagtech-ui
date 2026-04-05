import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function Chevrondown({ color, className, ...rest }: IAttachIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || 'text-white_4'}
      {...rest}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
