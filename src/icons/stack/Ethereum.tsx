/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Ethereum({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M19.9965 0.833374L19.7427 1.69617V26.7326L19.9965 26.986L31.6181 20.1165L19.9965 0.833374Z"
        fill="#F8F8F8"
      />
      <path d="M19.9966 0.833374L8.375 20.1165L19.9966 26.986V14.8341V0.833374Z" fill="#F8F8F8" />
      <path
        d="M19.9966 29.1865L19.8535 29.3609V38.2794L19.9966 38.6972L31.6252 22.3204L19.9966 29.1865Z"
        fill="#A5B4FC"
      />
      <path d="M19.9966 38.697V29.1862L8.375 22.3202L19.9966 38.697Z" fill="#A5B4FC" />
      <path d="M19.9965 26.986L31.618 20.1165L19.9965 14.8342V26.986Z" fill="#F8F8F8" />
      <path d="M8.375 20.1164L19.9964 26.9859V14.8341L8.375 20.1164Z" fill="#F8F8F8" />
    </svg>
  );
}
