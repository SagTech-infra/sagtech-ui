/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function LangChain({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="20" cy="8" r="4" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="2" />
      <circle cx="8" cy="20" r="4" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="2" />
      <circle cx="32" cy="20" r="4" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="2" />
      <circle cx="20" cy="32" r="4" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="2" />
      <circle cx="20" cy="20" r="6" fill="#2DD4BF" />
      <path d="M20 12V14" stroke="#2DD4BF" strokeWidth="2" />
      <path d="M20 26V28" stroke="#2DD4BF" strokeWidth="2" />
      <path d="M12 20H14" stroke="#2DD4BF" strokeWidth="2" />
      <path d="M26 20H28" stroke="#2DD4BF" strokeWidth="2" />
    </svg>
  );
}
