/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Flutter({ ...rest }: IAttachIconProps) {
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
        d="M11.5664 25.6703L5.89453 19.9984L24.3111 1.58337H35.6534M35.6534 18.5767H24.3111L20.0624 22.8254L25.7343 28.4973"
        fill="#F8F8F8"
      />
      <path d="M20.0624 34.1677L24.3111 38.4164H35.6534L25.7343 28.4973" fill="#A5B4FC" />
      <path
        d="M14.4039 28.5003L20.9002 22.0026L26.5631 27.6655L20.0668 34.1633L14.4039 28.5003Z"
        fill="#F8F8F8"
      />
      <path
        d="M20.0668 34.1633L25.7298 28.5004L26.5203 29.2909L20.8573 34.9538L20.0668 34.1633Z"
        fill="url(#paint0_linear_399_797)"
      />
      <path
        d="M20.0624 34.1677L28.4779 31.2603L25.7343 28.4958"
        fill="url(#paint1_linear_399_797)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_399_797"
          x1="22.8994"
          y1="31.3308"
          x2="23.6899"
          y2="32.1213"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.2" stopOpacity="0.15" />
          <stop offset="0.85" stopColor="#616161" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_399_797"
          x1="20.0644"
          y1="31.332"
          x2="28.4798"
          y2="31.332"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.2" stopColor="#8C9EF2" stopOpacity="0.55" />
          <stop offset="0.85" stopColor="#8C9EF2" stopOpacity="0.01" />
        </linearGradient>
      </defs>
    </svg>
  );
}
