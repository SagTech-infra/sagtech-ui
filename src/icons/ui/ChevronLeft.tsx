import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function ChevronLeft({ color, ...rest }: IAttachIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
      {...rest}
    >
      <path
        d="M11.5575 5.5575L10.5 4.5L6 9L10.5 13.5L11.5575 12.4425L8.1225 9L11.5575 5.5575Z"
        fill="currentColor"
      />
    </svg>
  );
}
