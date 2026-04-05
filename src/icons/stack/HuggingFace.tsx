/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function HuggingFace({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="20" cy="20" r="16" fill="#FFD21E" />
      <ellipse cx="13" cy="17" rx="3" ry="4" fill="#1A1A1A" />
      <ellipse cx="27" cy="17" rx="3" ry="4" fill="#1A1A1A" />
      <ellipse cx="14" cy="16" rx="1.5" ry="2" fill="white" />
      <ellipse cx="28" cy="16" rx="1.5" ry="2" fill="white" />
      <path
        d="M12 26C12 26 16 30 20 30C24 30 28 26 28 26"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="8" cy="20" rx="2" ry="3" fill="#FF6B6B" />
      <ellipse cx="32" cy="20" rx="2" ry="3" fill="#FF6B6B" />
    </svg>
  );
}
