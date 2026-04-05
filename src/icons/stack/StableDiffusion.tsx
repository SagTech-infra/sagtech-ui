/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function StableDiffusion({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="20" cy="20" r="16" fill="#7C3AED" />
      <path
        d="M12 20C12 20 14 14 20 14C26 14 28 20 28 20C28 20 26 26 20 26C14 26 12 20 12 20Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="20" cy="20" r="4" fill="#7C3AED" />
      <circle cx="20" cy="20" r="2" fill="white" />
      <path
        d="M8 12L12 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      <path
        d="M32 12L28 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      <path
        d="M8 28L12 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      <path
        d="M32 28L28 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
