/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Ton({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="41"
      height="37"
      viewBox="0 0 41 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M21.0425 32.5371L7.20672 10.0092C7.20672 10.0092 6.52591 8.87326 6.45884 8.06239C6.38859 7.21309 6.57816 6.70921 6.92627 5.93012C7.25001 5.20556 8.32481 4.49031 8.42203 4.53951L21.0425 4.53951M21.0425 32.5371L34.7849 10.2874C34.7849 10.2874 35.4144 9.02516 35.4393 8.15509C35.4604 7.41696 35.4295 6.94504 35.0653 6.30095C34.7999 5.83149 34.5629 5.60643 34.1305 5.28117C33.5039 4.80987 32.2608 4.53951 32.2608 4.53951L21.0425 4.53951M21.0425 32.5371V4.53951"
        stroke="#EEEDED"
        strokeWidth="4"
      />
    </svg>
  );
}
