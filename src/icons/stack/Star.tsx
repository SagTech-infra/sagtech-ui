/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Star({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M11.9989 18.26L4.94594 22.208L6.52094 14.28L0.585938 8.792L8.61294 7.84L11.9989 0.5L15.3849 7.84L23.4119 8.792L17.4769 14.28L19.0519 22.208L11.9989 18.26Z"
        fill="white"
      />
    </svg>
  );
}
