import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function HistoryPoint({ color, ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...rest}
    >
      <circle cx="12" cy="12" r="12" fill={color || '#6D3EF1'} />
      <path
        d="M12 6L13.6205 10.3795L18 12L13.6205 13.6205L12 18L10.3795 13.6205L6 12L10.3795 10.3795L12 6Z"
        fill="white"
      />
    </svg>
  );
}
