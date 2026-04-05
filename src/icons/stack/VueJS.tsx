/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function VueJS({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_399_1137)">
        <path d="M24.6192 2.5L20 10.5L15.3808 2.5H0L20 37.1416L40 2.5H24.6192Z" fill="white" />
        <path d="M24.6192 2.5L20 10.5L15.3808 2.5H8L20 23.284L32 2.5H24.6192Z" fill="#A5B4FC" />
      </g>
      <defs>
        <clipPath id="clip0_399_1137">
          <rect width="40" height="34.6416" fill="white" transform="translate(0 2.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
