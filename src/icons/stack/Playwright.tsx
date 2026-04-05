/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Playwright({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="20" cy="20" r="16" fill="#2D4552" />
      <circle cx="14" cy="16" r="4" fill="#E2574C" />
      <circle cx="26" cy="16" r="4" fill="#1D8F46" />
      <path
        d="M12 26C12 26 16 30 20 30C24 30 28 26 28 26"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="16" r="2" fill="white" />
      <circle cx="26" cy="16" r="2" fill="white" />
    </svg>
  );
}
