/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function FastAPI({ ...rest }: IAttachIconProps) {
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
        d="M20.3334 36.6667C29.5381 36.6667 37 29.2048 37 20C37 10.7953 29.5381 3.33337 20.3334 3.33337C11.1286 3.33337 3.66669 10.7953 3.66669 20C3.66669 29.2048 11.1286 36.6667 20.3334 36.6667Z"
        fill="#F8F8F8"
      />
      <path
        d="M21.0741 7.5L13.6667 22.5001H20.3334L19.5926 32.5L27 17.4999H20.3334L21.0741 7.5Z"
        fill="#292A94"
      />
    </svg>
  );
}
