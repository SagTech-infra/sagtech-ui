import type { SVGProps } from 'react';

export function NotCheckedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 2.992V21.008C20.9979 21.2706 20.8926 21.5219 20.7068 21.7075C20.521 21.8931 20.2696 21.9982 20.007 22H3.993C3.72981 22 3.47739 21.8955 3.2912 21.7095C3.105 21.5235 3.00027 21.2712 3 21.008V2.992C3.00209 2.72938 3.10742 2.47813 3.29322 2.29251C3.47902 2.1069 3.73038 2.00183 3.993 2H20.007C20.555 2 21 2.444 21 2.992ZM19 4H5V20H19V4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CheckedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 2.992V21.008C20.9979 21.2706 20.8926 21.5219 20.7068 21.7075C20.521 21.8931 20.2696 21.9982 20.007 22H3.993C3.72981 22 3.47739 21.8955 3.2912 21.7095C3.105 21.5235 3.00027 21.2712 3 21.008V2.992C3.00209 2.72938 3.10742 2.47813 3.29322 2.29251C3.47902 2.1069 3.73038 2.00183 3.993 2H20.007C20.555 2 21 2.444 21 2.992ZM19 4H5V20H19V4ZM11.293 13.121L15.536 8.879L16.95 10.293L11.293 15.95L7.403 12.06L8.818 10.646L11.293 13.121Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CheckedRoundIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M9.99935 18.3307C5.39685 18.3307 1.66602 14.5999 1.66602 9.9974C1.66602 5.3949 5.39685 1.66406 9.99935 1.66406C14.6018 1.66406 18.3327 5.3949 18.3327 9.9974C18.3327 14.5999 14.6018 18.3307 9.99935 18.3307ZM9.99935 16.6641C11.7675 16.6641 13.4632 15.9617 14.7134 14.7114C15.9636 13.4612 16.666 11.7655 16.666 9.9974C16.666 8.22929 15.9636 6.53359 14.7134 5.28335C13.4632 4.03311 11.7675 3.33073 9.99935 3.33073C8.23124 3.33073 6.53555 4.03311 5.2853 5.28335C4.03506 6.53359 3.33268 8.22929 3.33268 9.9974C3.33268 11.7655 4.03506 13.4612 5.2853 14.7114C6.53555 15.9617 8.23124 16.6641 9.99935 16.6641ZM9.16852 13.3307L5.63268 9.7949L6.81102 8.61656L9.16852 10.9741L13.8819 6.2599L15.061 7.43823L9.16852 13.3307Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CheckedRoundFilledIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="74"
      height="67"
      viewBox="0 0 74 67"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_d_2816_42972)">
        <circle cx="37.0996" cy="30" r="28" fill="#8675BA" />
        <path
          d="M26.25 30L33.75 37.5L48.75 22.5"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2816_42972"
          x="-1.03333"
          y="-8.53333"
          width="77.0667"
          height="77.0667"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4.26667" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.427451 0 0 0 0 0.243137 0 0 0 0 0.945098 0 0 0 0.56 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2816_42972" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2816_42972"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
