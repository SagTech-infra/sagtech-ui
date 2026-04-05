import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function SphereIcon({ color, ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="364"
      height="334"
      viewBox="0 0 364 334"
      fill="none"
      {...rest}
    >
      <path
        d="M172.923 -102.8L211.263 -107.988L213.614 -106.825L218.965 -104.109L227.206 -99.8875L261.248 -100.891L268.779 -97.0854L277.865 -92.4602L301.988 -91.0531L309.041 -88.5202L315.482 -86.2932L323.074 -83.4667L326.919 -80.9828L330.017 -78.56L336.238 -73.4086L336.446 -73.2496L341.613 -70.5209L346.144 -68.1104L349.989 -66.1649L352.781 -64.513L358.904 -58.7009L369.08 -49.0589L378.398 -40.2244L378.778 -39.8574L382.427 -37.8384L384.043 -36.8718L393.141 -25.0272L402.889 -12.3384L407.444 -6.4162L407.566 -6.25712L419.946 17.5298L425.408 28.0283"
        stroke={color}
        strokeWidth="1.08501"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_430_11894"
          x1="14.0184"
          y1="-79.1153"
          x2="411.895"
          y2="245.125"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#544876" />
          <stop offset="1" stopColor="#CCBDFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}
