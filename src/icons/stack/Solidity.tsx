/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Solidity({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_399_1121)">
        <path
          opacity="0.45"
          d="M26.9469 0.000976562L20.5165 11.4302H7.66388L14.0894 0.000976562H26.9469Z"
          fill="white"
        />
        <path
          opacity="0.6"
          d="M20.5164 11.4301H33.3725L26.9474 0.000854492H14.0894L20.5164 11.4301Z"
          fill="white"
        />
        <path
          opacity="0.8"
          d="M14.0894 22.8545L20.5165 11.4302L14.0894 0.000976562L7.66388 11.4302L14.0894 22.8545Z"
          fill="white"
        />
        <path
          opacity="0.45"
          d="M14.1524 39.9992L20.5829 28.5699H33.4399L27.0094 39.9992H14.1524Z"
          fill="white"
        />
        <path
          opacity="0.6"
          d="M20.5829 28.5699H7.72687L14.1524 39.9992H27.0094L20.5829 28.5699Z"
          fill="white"
        />
        <path
          opacity="0.8"
          d="M27.0094 17.1447L20.5829 28.5699L27.0094 39.9991L33.4399 28.5699L27.0094 17.1447Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_399_1121">
          <rect width="25.776" height="40" fill="white" transform="translate(7.66388)" />
        </clipPath>
      </defs>
    </svg>
  );
}
