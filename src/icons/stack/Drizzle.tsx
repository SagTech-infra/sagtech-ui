/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Drizzle({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="8" y="8" width="8" height="24" rx="4" fill="#C5F74F" />
      <rect x="20" y="8" width="8" height="24" rx="4" fill="#C5F74F" transform="translate(0, 4)" />
      <rect x="8" y="12" width="8" height="24" rx="4" fill="#C5F74F" opacity="0.6" />
      <rect x="20" y="8" width="8" height="20" rx="4" fill="#C5F74F" />
      <rect x="32" y="12" width="8" height="16" rx="4" fill="#C5F74F" transform="translate(-4, 0)" />
    </svg>
  );
}
