/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Pinecone({ ...rest }: IAttachIconProps) {
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
        d="M20 4L24 10L20 8L16 10L20 4Z"
        fill="#00A67E"
      />
      <ellipse cx="20" cy="14" rx="6" ry="4" fill="#00A67E" />
      <ellipse cx="20" cy="20" rx="8" ry="5" fill="#00A67E" />
      <ellipse cx="20" cy="26" rx="7" ry="4" fill="#00A67E" />
      <ellipse cx="20" cy="31" rx="5" ry="3" fill="#00A67E" />
      <path
        d="M20 34V38"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
