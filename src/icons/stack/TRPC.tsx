/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function TRPC({ ...rest }: IAttachIconProps) {
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
        d="M20 4L4 12V28L20 36L36 28V12L20 4Z"
        fill="#398CCB"
      />
      <path
        d="M20 8L8 14V26L20 32L32 26V14L20 8Z"
        fill="#398CCB"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="20" cy="20" r="4" fill="white" />
      <path
        d="M14 14L20 20L26 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 26L20 20L26 26"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
