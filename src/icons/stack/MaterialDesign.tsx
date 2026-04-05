/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function MaterialDesign({ ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      {...rest}
    >
      <path
        d="M20.2223 40C31.268 40 40.2223 31.0457 40.2223 20C40.2223 8.9543 31.268 0 20.2223 0C9.17659 0 0.22229 8.9543 0.22229 20C0.22229 31.0457 9.17659 40 20.2223 40Z"
        fill="#A5B4FC"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.41583 6.19354H34.0287V33.8064H6.41583V6.19354Z"
        fill="#8C9EF2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.6301 6.19354H6.81458L20.2223 33.009L33.6301 6.19354Z"
        fill="white"
      />
    </svg>
  );
}
