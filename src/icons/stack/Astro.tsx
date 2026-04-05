/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Astro({ ...rest }: IAttachIconProps) {
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
        d="M13.5 26C13.5 28.5 15 30 17 30.5C17 29 17.5 27 20 27C22.5 27 23 29 23 30.5C25 30 26.5 28.5 26.5 26C26.5 23 24 21 20 21C16 21 13.5 23 13.5 26Z"
        fill="#FF5D01"
      />
      <path
        d="M8 32L14 8H26L32 32C32 32 28 28 20 28C12 28 8 32 8 32Z"
        fill="url(#astro_gradient)"
      />
      <defs>
        <linearGradient id="astro_gradient" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
