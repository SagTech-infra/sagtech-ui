/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Replicate({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="6" y="6" width="12" height="12" rx="2" fill="#F43F5E" />
      <rect x="22" y="6" width="12" height="12" rx="2" fill="#F43F5E" opacity="0.7" />
      <rect x="6" y="22" width="12" height="12" rx="2" fill="#F43F5E" opacity="0.7" />
      <rect x="22" y="22" width="12" height="12" rx="2" fill="#F43F5E" opacity="0.4" />
    </svg>
  );
}
