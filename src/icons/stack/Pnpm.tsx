/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Pnpm({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="4" y="4" width="10" height="10" fill="#F9AD00" />
      <rect x="15" y="4" width="10" height="10" fill="#F9AD00" />
      <rect x="26" y="4" width="10" height="10" fill="#F9AD00" />
      <rect x="4" y="15" width="10" height="10" fill="#F9AD00" />
      <rect x="15" y="15" width="10" height="10" fill="#4E4E4E" />
      <rect x="15" y="26" width="10" height="10" fill="#4E4E4E" />
      <rect x="26" y="15" width="10" height="10" fill="#4E4E4E" />
      <rect x="26" y="26" width="10" height="10" fill="#4E4E4E" />
    </svg>
  );
}
