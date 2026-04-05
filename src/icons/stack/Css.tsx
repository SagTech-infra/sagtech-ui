/* eslint-disable react/jsx-props-no-spreading */
import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function Css({ ...rest }: IAttachIconProps) {
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
        d="M2.96728 35.8629L0.0327759 0L35.0784 0.0720695L31.9754 35.8629L17.6878 40L2.96728 35.8629Z"
        fill="#A5B4FC"
      />
      <path
        d="M17.6878 36.5365V3.41556L32.1198 3.4636L29.5462 33.0969L17.6878 36.5365Z"
        fill="#8C9EF2"
      />
      <path
        d="M28.5358 7.64899H6.33475L6.93617 11.9782H17.4713L7.10462 16.4282L7.70576 20.6133H22.9797L22.4263 26.458L17.2548 27.4684L12.5647 26.2658L12.2038 22.9464H7.89823L8.47535 29.8498L17.7118 32.4234L26.5637 29.6093L27.6942 16.1153H18.337L28.5356 11.8822L28.5358 7.64899Z"
        fill="white"
      />
    </svg>
  );
}
