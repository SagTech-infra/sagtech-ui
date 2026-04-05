/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function PlanetScale({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="20" cy="20" r="16" fill="white" />
      <path
        d="M20 4C11.163 4 4 11.163 4 20C4 21.5 4.2 22.95 4.57 24.33L24.33 4.57C22.95 4.2 21.5 4 20 4Z"
        fill="white"
      />
      <path
        d="M4.57 24.33C6.57 32 13.57 37.67 22 35.77L4.57 24.33Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 11.163 28.837 4 20 4ZM6 20C6 12.268 12.268 6 20 6C21.126 6 22.22 6.127 23.27 6.368L6.368 23.27C6.127 22.22 6 21.126 6 20ZM8.05 26.536L26.536 8.05C31.45 10.178 34.83 15.05 34.83 20.68L20.68 34.83C15.05 34.83 10.178 31.45 8.05 26.536Z"
        fill="#000000"
      />
    </svg>
  );
}
