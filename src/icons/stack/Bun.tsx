/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Bun({ ...rest }: IAttachIconProps) {
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
        d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 11.163 28.837 4 20 4Z"
        fill="#FBF0DF"
      />
      <path
        d="M20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6ZM14 18C14.552 18 15 18.448 15 19C15 19.552 14.552 20 14 20C13.448 20 13 19.552 13 19C13 18.448 13.448 18 14 18ZM26 18C26.552 18 27 18.448 27 19C27 19.552 26.552 20 26 20C25.448 20 25 19.552 25 19C25 18.448 25.448 18 26 18ZM20 28C16.134 28 13 25.314 13 22H27C27 25.314 23.866 28 20 28Z"
        fill="#F9E1C0"
      />
      <ellipse cx="14" cy="19" rx="2" ry="2.5" fill="#3C3C3C" />
      <ellipse cx="26" cy="19" rx="2" ry="2.5" fill="#3C3C3C" />
      <path
        d="M13 23C13 23 15 27 20 27C25 27 27 23 27 23"
        stroke="#F472B6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 12C10 8 14 6 20 6"
        stroke="#FBF0DF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
