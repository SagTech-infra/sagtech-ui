import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function SliderButton({ ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...rest}
    >
      <rect width="40" height="40" rx="20" fill="#6D3EF1" />
      <path
        d="M26 19.9996H14M14 19.9996L17 22.9996M14 19.9996L17 17.0002"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
