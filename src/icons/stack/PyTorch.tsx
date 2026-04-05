/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function PyTorch({ ...rest }: IAttachIconProps) {
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
        d="M30.4269 12.6433L27.8321 15.2381C32.0781 19.4842 32.0781 26.325 27.8321 30.4924C23.586 34.7385 16.7452 34.7385 12.5778 30.4924C8.33172 26.2464 8.33172 19.4056 12.5778 15.2381L19.3007 8.51522L20.2442 7.57167V2.5L10.1009 12.6433C4.43951 18.3047 4.43951 27.4258 10.1009 33.0872C15.7623 38.7486 24.8834 38.7486 30.4269 33.0872C36.0883 27.3865 36.0883 18.3047 30.4269 12.6433Z"
        fill="#F8F8F8"
      />
      <path
        d="M25.3552 12.0143C26.3974 12.0143 27.2423 11.1694 27.2423 10.1271C27.2423 9.08491 26.3974 8.23999 25.3552 8.23999C24.313 8.23999 23.4681 9.08491 23.4681 10.1271C23.4681 11.1694 24.313 12.0143 25.3552 12.0143Z"
        fill="#F8F8F8"
      />
    </svg>
  );
}
