/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Expo({ ...rest }: IAttachIconProps) {
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
        d="M20 6C20 6 8 20 8 26C8 32 13 36 20 36C27 36 32 32 32 26C32 20 20 6 20 6Z"
        fill="#000020"
      />
      <path
        d="M20 10C20 10 12 20 12 25C12 30 15 33 20 33C25 33 28 30 28 25C28 20 20 10 20 10Z"
        fill="#FFFFFF"
      />
      <path
        d="M20 14L16 24H24L20 14Z"
        fill="#000020"
      />
    </svg>
  );
}
