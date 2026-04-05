/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Turborepo({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="20" cy="20" r="16" fill="#0F0F0F" />
      <circle cx="20" cy="20" r="12" stroke="#FF1E56" strokeWidth="2" fill="none" />
      <circle cx="20" cy="20" r="8" stroke="#FF1E56" strokeWidth="2" fill="none" />
      <circle cx="20" cy="20" r="4" fill="#FF1E56" />
      <path
        d="M20 8V4"
        stroke="#FF1E56"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 36V32"
        stroke="#FF1E56"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 20H4"
        stroke="#FF1E56"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M36 20H32"
        stroke="#FF1E56"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
