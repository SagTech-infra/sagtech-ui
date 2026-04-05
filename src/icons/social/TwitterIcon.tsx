import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function TwitterIcon({ ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...rest}
    >
      <path
        d="M16 32C24.8365 32 32 24.8365 32 16C32 7.16347 24.8365 0 16 0C7.16347 0 0 7.16347 0 16C0 24.8365 7.16347 32 16 32Z"
        fill="white"
        fillOpacity="0.04"
      />
      <path d="M22.9799 22.6385L17.5178 14.7033L16.9003 13.8059L12.9932 8.12959L12.6693 7.65918H7.86841L9.03935 9.36077L14.2344 16.9089L14.8519 17.8054L19.026 23.8702L19.3499 24.3402H24.1509L22.98 22.6386L22.9799 22.6385ZM19.9203 23.2541L15.5837 16.9534L14.9662 16.0565L9.93419 8.74531H12.0988L16.1683 14.6581L16.7858 15.555L22.085 23.2541H19.9204H19.9203Z" />
      <path d="M14.9661 16.0562L15.5836 16.9531L14.8515 17.8051L9.23451 24.3397H7.84937L14.234 16.9086L14.9661 16.0562Z" />
      <path d="M23.5726 7.65918L17.5177 14.7033L16.7856 15.5548L16.1681 14.6579L16.9002 13.8059L21.0017 9.03198L22.1875 7.65918H23.5726Z" />
    </svg>
  );
}
