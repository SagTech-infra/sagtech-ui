/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Cloudflare({ ...rest }: IAttachIconProps) {
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
        d="M28 27H10C8.5 27 8 25.5 8.5 24.5C9 23.5 10 23 11 23H28C30 23 31.5 21.5 31.5 19.5C31.5 17.5 30 16 28 16C27.5 16 27 16.1 26.5 16.3C26 13.8 23.8 12 21 12C18.5 12 16.4 13.5 15.5 15.5C14.9 15.2 14.2 15 13.5 15C11 15 9 17 9 19.5C9 19.7 9 19.9 9.1 20.1C7.3 20.5 6 22.1 6 24C6 26.2 7.8 28 10 28H28C29.1 28 30 27.1 30 26C30 24.9 29.1 27 28 27Z"
        fill="#F38020"
      />
      <path
        d="M32 20C32 18 30.5 16.5 28.5 16.5C28.3 16.5 28.1 16.5 27.9 16.6C27.3 14 25 12 22 12C20.2 12 18.6 12.8 17.5 14.1"
        stroke="#FAAE40"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
