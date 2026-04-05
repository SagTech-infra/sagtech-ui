/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function DigitalOcean({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.8735 36.7452V30.2702C27.7273 30.2702 33.0476 23.4734 30.4156 16.2597C29.9322 14.9345 29.165 13.731 28.1676 12.7335C27.1702 11.7359 25.9667 10.9685 24.6416 10.485C17.4279 7.87247 10.6311 13.1733 10.6311 20.0271H4.1748C4.1748 9.10368 14.7396 0.583737 26.1938 4.16142C31.1924 5.73377 35.1869 9.7089 36.7399 14.7081C40.3182 26.1804 31.817 36.7452 20.8735 36.7452Z"
        fill="#F8F8F8"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4555 30.2889H20.8923V23.8521H14.4561L14.4555 30.2889ZM9.49509 35.2493H14.4548V30.2896H9.49509V35.2493ZM5.34839 30.2896H9.49509V26.1422H5.34839V30.2896Z"
        fill="#F8F8F8"
      />
    </svg>
  );
}
