/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Angular({ ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="39"
      height="40"
      viewBox="0 0 39 40"
      fill="none"
      {...rest}
    >
      <path
        d="M3.64957 31.2799L19.5153 40L35.4627 31.1618L38.4356 6.50583L19.4953 0L0.675568 6.62304L3.64957 31.2799Z"
        fill="white"
      />
      <path
        d="M19.4513 37.9166L33.7878 29.9821L36.5584 7.93082L19.4513 2.09708V37.9166Z"
        fill="#8C9EF2"
      />
      <path
        d="M19.4511 37.9166V2.09637L2.78745 8.03595L5.33584 30.0875L19.4511 37.9166Z"
        fill="#A5B4FC"
      />
      <path
        d="M24.1603 21.1655L19.4513 23.3675H14.4882L12.1551 29.2031L7.81549 29.2834L19.4513 3.3978L24.1603 21.1655ZM23.7051 20.0569L19.4825 11.6975L16.019 19.9131H19.4511L23.7051 20.0569Z"
        fill="white"
      />
      <path
        d="M23.4124 19.9194H19.46L19.4511 23.3623L24.9164 23.3675L27.4707 29.2843L31.6229 29.3613L19.4511 3.3978L19.4823 11.6975L23.4124 19.9194Z"
        fill="#F2F2F2"
      />
    </svg>
  );
}
