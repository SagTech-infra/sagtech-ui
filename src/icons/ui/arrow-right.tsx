import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function ArrowRight({ color, ...rest }: IAttachIconProps) {
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
        d="M16.172 10.9967L10.808 5.63275L12.222 4.21875L20 11.9967L12.222 19.7747L10.808 18.3608L16.172 12.9967H4V10.9967H16.172Z"
        fill={color || 'currentColor'}
      />
    </svg>
  );
}
