/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Capacitor({ ...rest }: IAttachIconProps) {
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
        d="M20 4L36 12V28L20 36L4 28V12L20 4Z"
        fill="#53B9FF"
      />
      <path
        d="M20 8L32 14V26L20 32L8 26V14L20 8Z"
        fill="#119EFF"
      />
      <circle cx="20" cy="20" r="6" fill="white" />
      <circle cx="20" cy="20" r="3" fill="#119EFF" />
    </svg>
  );
}
