/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function MicrosoftAzure({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_4234_24544)">
        <path
          d="M28.1596 32.6583C28.1108 32.6687 23.8662 33.4199 18.7272 34.3277L9.3834 35.9783L24.8028 35.9803L40.2222 35.9823L40.159 35.8718C40.1242 35.8111 36.3839 29.328 31.8472 21.4649C27.0015 13.0662 23.5921 7.17997 23.5827 7.19638C23.5545 7.24546 18.5446 21.0416 18.5446 21.0701C18.5446 21.0851 20.7279 23.6944 23.3964 26.8685L28.2482 32.6395L28.1596 32.6583Z"
          fill="white"
        />
        <path
          d="M5.30248 23.7488C2.50831 28.5911 0.222168 32.5597 0.222168 32.5678C0.222168 32.5759 2.28833 32.58 4.81363 32.5768L9.4051 32.5711L15.7193 19.0289C19.1921 11.5807 22.085 5.37555 22.1481 5.2397C22.2112 5.10384 22.254 4.99603 22.2433 5.00011C22.2326 5.0042 19.5596 7.24336 16.3033 9.97604L10.3828 14.9445L5.30248 23.7488Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_4234_24544">
          <rect width="40" height="40" fill="white" transform="translate(0.222168)" />
        </clipPath>
      </defs>
    </svg>
  );
}
