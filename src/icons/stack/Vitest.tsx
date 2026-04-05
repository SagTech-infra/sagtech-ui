/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Vitest({ ...rest }: IAttachIconProps) {
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
        d="M30 8L20 28L10 8H16L20 18L24 8H30Z"
        fill="#FCC72B"
      />
      <path
        d="M6 8L20 36L34 8H28L20 26L12 8H6Z"
        fill="#729B1B"
      />
    </svg>
  );
}
