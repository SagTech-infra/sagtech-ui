/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Hono({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M20 4C14 8 12 14 12 20C12 28 16 36 24 36C32 36 34 28 34 24C34 20 32 18 32 18C32 22 30 26 26 26C22 26 20 22 20 18C20 14 22 10 22 10C18 10 16 14 16 18C16 22 18 26 22 28C14 26 12 20 14 14C14 14 18 4 20 4Z"
        fill="url(#hono_gradient)"
      />
      <defs>
        <linearGradient id="hono_gradient" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35" />
          <stop offset="1" stopColor="#F7931E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
