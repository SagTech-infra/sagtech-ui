/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function MaterialUI({ ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="32"
      viewBox="0 0 40 32"
      fill="none"
      {...rest}
    >
      <path d="M0 17.4433V0.123322L15 8.78332V14.5567L5 8.78332V20.33L0 17.4433Z" fill="white" />
      <path
        d="M15 8.78332L30 0.123322V17.4433L20 23.2167L15 20.33L25 14.5567V8.78332L15 14.5567V8.78332Z"
        fill="#A5B4FC"
      />
      <path d="M15 20.33V26.1033L25 31.8767V26.1033L15 20.33Z" fill="white" />
      <path
        d="M25 31.8767L40 23.2167V11.67L35 14.5567V20.33L25 26.1033V31.8767ZM35 8.78332V3.00999L40 0.123322V5.89666L35 8.78332Z"
        fill="#A5B4FC"
      />
    </svg>
  );
}
