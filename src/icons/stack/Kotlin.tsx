/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Kotlin({ ...rest }: IAttachIconProps) {
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
        d="M36.6667 3.33337H20.0694L4.22083 20H19.9708L20.0444 19.925L36.6667 3.33337Z"
        fill="#A5B4FC"
      />
      <path d="M20.0694 3.33337H3.33331V20.9334V20H4.22081L20.0694 3.33337Z" fill="#F8F8F8" />
      <path d="M19.9708 20H4.22081L3.33331 20.9333V36.6667L19.9708 20Z" fill="#8C9EF2" />
      <path d="M20.1194 20H19.9708L3.33331 36.6667H36.6666L20.1194 20Z" fill="#F8F8F8" />
      <path d="M4.22081 20H3.33331V20.9333L4.22081 20Z" fill="#F8F8F8" />
    </svg>
  );
}
