/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Anthropic({ ...rest }: IAttachIconProps) {
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
        d="M24.5 8L32 32H26L24.5 27.5H15.5L14 32H8L15.5 8H24.5Z"
        fill="#D4A574"
      />
      <path
        d="M20 14L23 24H17L20 14Z"
        fill="#1A1A1A"
      />
    </svg>
  );
}
