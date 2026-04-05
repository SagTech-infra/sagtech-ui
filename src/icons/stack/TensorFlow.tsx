/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function TensorFlow({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <mask id="mask0_399_920" maskUnits="userSpaceOnUse" x="21" y="1" width="16" height="38">
        <path
          d="M36.7893 10.6299L21.0336 1.66663V38.4999L27.3358 34.8586V24.4949L32.0976 27.2259L32.0275 20.1533L27.3358 17.4223V13.2908L36.7893 18.8228V10.6299Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_399_920)">
        <path d="M2.40683 1.52661H41.0608V38.57H2.40683V1.52661Z" fill="#F8F8F8" />
      </g>
      <mask id="mask1_399_920" maskUnits="userSpaceOnUse" x="3" y="1" width="17" height="38">
        <path
          d="M3.87738 10.6299L19.6331 1.66663V38.4999L13.3308 34.8586V13.2908L3.87738 18.8228V10.6299Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask1_399_920)">
        <path d="M2.19678 1.52661H40.8507V38.57H2.19678V1.52661Z" fill="#F8F8F8" />
      </g>
    </svg>
  );
}
