import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function FintechLogoIcon({ ...rest }: IAttachIconProps) {
  return (
    <svg
      width="886"
      height="438"
      viewBox="0 0 886 438"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g opacity="0.5">
        <path
          d="M754.862 79.2107L780.818 96.9806L806.444 78.7344L788.638 104.638L806.958 130.175L781.002 112.442L755.376 130.688L773.145 104.785L754.862 79.2107Z"
          fill="url(#paint0_linear_799_43463)"
        />
        <path
          d="M713.559 68.5547L724.904 49.9055L711.209 32.8683L729.897 44.1898L746.968 30.5234L735.624 49.1727L749.318 66.2098L730.631 54.8884L713.559 68.5547Z"
          fill="url(#paint1_linear_799_43463)"
        />
        <path
          d="M670.201 37.7381L676.185 20.1514L661.684 8.50024L679.306 14.4724L690.981 0L684.997 17.5867L699.498 29.2379L681.876 23.2658L670.201 37.7381Z"
          fill="url(#paint2_linear_799_43463)"
        />
        <path
          d="M377.229 333.453C372.236 316.6 370.07 298.976 370.951 281.426C375.1 195.581 449.297 128.385 535.28 132.525C596.517 135.493 650.413 173.964 673.211 230.315"
          fill="url(#paint3_linear_799_43463)"
        />
        <path
          d="M837.76 162.348C806.371 170.372 773.108 159.71 752.255 134.979L741.278 121.899C691.568 56.6081 611.607 16.1953 525.037 16.1953C378.073 16.1953 257.14 132.634 257.14 274.097L258.021 286.774C260.738 325.355 238.93 361.518 203.502 377.199L0 467.221L538.547 291.684L1050 108.013L837.76 162.348ZM703.61 216.024L529.075 278.127L343.71 340.23C332.145 344.187 329.832 338.728 327.483 326.711C324.105 309.71 324.766 293.076 324.766 278.091C324.766 171.398 414.016 83.6477 529.075 83.6477C588.918 83.6477 640.28 111.86 679.269 151.173C692.266 164.29 705.629 175.428 714.441 191.696C720.388 202.688 715.505 212.031 703.61 215.988V216.024Z"
          fill="url(#paint4_linear_799_43463)"
        />
        <path
          d="M755.523 274.092C771.456 274.642 784.049 288.198 781.846 304.136C775.678 348.103 758.974 390.018 733.017 425.961C701.407 469.745 657.608 502.646 607.385 520.27C557.161 537.893 502.898 539.469 451.794 524.74C409.757 512.612 371.502 489.969 340.369 459.009C329.135 447.834 330.897 429.552 342.939 419.256L372.383 394.122C397.715 425.375 431.675 448.018 469.783 458.973C507.891 469.964 548.386 468.792 585.834 455.639C623.281 442.485 655.993 417.937 679.563 385.292C703.133 352.646 716.496 313.406 717.855 272.773L755.523 274.092Z"
          fill="url(#paint5_linear_799_43463)"
        />
        <path
          d="M669.944 286.258C668.549 295.674 658.232 358.547 599.822 395.186C593.69 399.033 532.159 436.221 466.809 409.145C441.257 398.556 424.552 382.032 415.374 371.334"
          fill="url(#paint6_linear_799_43463)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_799_43463" x1="780.91" y1="78.7344" x2="780.91" y2="130.688" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
        <linearGradient id="paint1_linear_799_43463" x1="730.264" y1="30.5234" x2="730.264" y2="68.5547" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
        <linearGradient id="paint2_linear_799_43463" x1="680.591" y1="0" x2="680.591" y2="37.7381" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
        <linearGradient id="paint3_linear_799_43463" x1="521.985" y1="132.344" x2="521.985" y2="333.453" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
        <linearGradient id="paint4_linear_799_43463" x1="525" y1="16.1953" x2="525" y2="467.221" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
        <linearGradient id="paint5_linear_799_43463" x1="557.473" y1="272.773" x2="557.473" y2="534.743" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
        <linearGradient id="paint6_linear_799_43463" x1="542.659" y1="286.258" x2="542.659" y2="418.948" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE7FF" />
          <stop offset="1" stopColor="#AA97E1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
