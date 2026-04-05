/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Ollama({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <ellipse cx="20" cy="24" rx="14" ry="10" fill="#FFFFFF" />
      <ellipse cx="20" cy="22" rx="12" ry="8" fill="#1A1A1A" />
      <circle cx="15" cy="20" r="3" fill="white" />
      <circle cx="25" cy="20" r="3" fill="white" />
      <circle cx="15" cy="20" r="1.5" fill="#1A1A1A" />
      <circle cx="25" cy="20" r="1.5" fill="#1A1A1A" />
      <ellipse cx="20" cy="26" rx="4" ry="2" fill="#FFB6C1" />
      <path
        d="M14 12C14 12 16 8 20 8C24 8 26 12 26 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
