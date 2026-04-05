/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Zod({ ...rest }: IAttachIconProps) {
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
        d="M20 4L4 12L20 20L36 12L20 4Z"
        fill="#3068B7"
      />
      <path
        d="M4 12V28L20 36V20L4 12Z"
        fill="#274B8D"
      />
      <path
        d="M36 12V28L20 36V20L36 12Z"
        fill="#3068B7"
      />
      <path
        d="M12 14L20 10L28 14L20 18L12 14Z"
        fill="white"
        fillOpacity="0.3"
      />
    </svg>
  );
}
