/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Ansible({ ...rest }: IAttachIconProps) {
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
        d="M20.4445 39C30.9385 39 39.4446 30.4939 39.4446 20.0001C39.4446 9.50705 30.9385 1 20.4445 1C9.95151 1 1.44446 9.50702 1.44446 20.0001C1.44446 30.4939 9.95148 39 20.4445 39ZM25.6812 24.742L20.7643 12.6066L18.2543 18.8918L25.6812 24.742ZM21.9359 9.3363L29.499 27.5374C29.5824 27.7602 29.6285 27.9672 29.6285 28.0976C29.6285 28.8993 28.9809 29.4547 28.2401 29.4547C27.8702 29.4547 27.5856 29.3104 27.1912 28.9915L17.385 21.0692L14.099 29.3006H11.2593L19.5603 9.3363C19.7762 8.81137 20.2394 8.53361 20.7643 8.53361C21.2883 8.53361 21.72 8.81137 21.9359 9.3363Z"
        fill="white"
      />
    </svg>
  );
}
