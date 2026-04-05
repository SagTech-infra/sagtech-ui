/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Supabase({ ...rest }: IAttachIconProps) {
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
        d="M22.5 37.5C21.5 39.5 18 38 18 35.5V20H32C34.5 20 36 23 34 25L22.5 37.5Z"
        fill="url(#supabase_gradient_a)"
      />
      <path
        d="M22.5 37.5C21.5 39.5 18 38 18 35.5V20H32C34.5 20 36 23 34 25L22.5 37.5Z"
        fill="url(#supabase_gradient_b)"
        fillOpacity="0.2"
      />
      <path
        d="M17.5 2.5C18.5 0.5 22 2 22 4.5V20H8C5.5 20 4 17 6 15L17.5 2.5Z"
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient id="supabase_gradient_a" x1="18" y1="23" x2="30" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient id="supabase_gradient_b" x1="14" y1="18" x2="18" y2="28" gradientUnits="userSpaceOnUse">
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
