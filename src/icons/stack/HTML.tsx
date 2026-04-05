/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function HTML({ ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="40"
      viewBox="0 0 36 40"
      fill="none"
      {...rest}
    >
      <path
        d="M3.74525 35.863L0.810791 0L35.8559 0.0720685L32.753 35.863L18.4656 40L3.74525 35.863Z"
        fill="#A5B4FC"
      />
      <path
        d="M18.4656 36.5365V3.4155L32.8974 3.46354L30.3238 33.0967L18.4656 36.5365Z"
        fill="#8C9EF2"
      />
      <path
        d="M28.9288 11.6898L29.3375 7.31198H7.13673L8.3633 20.7337H23.6851L23.0842 26.4582L18.1773 27.7808L13.1984 26.3378L12.9339 22.9223H8.53175L9.13317 29.8977L18.1771 32.4232L27.293 29.8977L28.5196 16.2838H12.4285L11.9715 11.6898H28.9288Z"
        fill="white"
      />
    </svg>
  );
}
