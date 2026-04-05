/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Terraform({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M26.9325 13.366V25.9861L37.8664 19.6799V7.04652L26.9325 13.366Z" fill="#8C9EF2" />
      <path
        d="M14.7996 7.04653L25.7335 13.366V25.9861L14.7996 19.6722V7.04653ZM2.66675 0V12.6268L13.6006 18.9407V6.31284L2.66675 0ZM14.7996 33.6861L25.7335 40V27.3721L14.7996 21.0593V33.6861Z"
        fill="#A5B4FC"
      />
    </svg>
  );
}
