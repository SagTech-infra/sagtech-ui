import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function CloseIcon({ color, ...rest }: IAttachIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      {...rest}
    >
      <path
        d="M2.92969 1.92896L17.0718 16.0711"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2.92969 16.071L17.0718 1.92891"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseRoundIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" {...props}>
      <path
        d="M20.0007 36.6693C10.7957 36.6693 3.33398 29.2076 3.33398 20.0026C3.33398 10.7976 10.7957 3.33594 20.0007 3.33594C29.2057 3.33594 36.6673 10.7976 36.6673 20.0026C36.6673 29.2076 29.2057 36.6693 20.0007 36.6693ZM20.0007 33.3359C23.5369 33.3359 26.9283 31.9312 29.4287 29.4307C31.9292 26.9302 33.334 23.5388 33.334 20.0026C33.334 16.4664 31.9292 13.075 29.4287 10.5745C26.9283 8.07403 23.5369 6.66927 20.0007 6.66927C16.4644 6.66927 13.073 8.07403 10.5726 10.5745C8.07208 13.075 6.66732 16.4664 6.66732 20.0026C6.66732 23.5388 8.07208 26.9302 10.5726 29.4307C13.073 31.9312 16.4644 33.3359 20.0007 33.3359ZM20.0007 17.6459L24.714 12.9309L27.0723 15.2893L22.3573 20.0026L27.0723 24.7159L24.714 27.0743L20.0007 22.3593L15.2873 27.0743L12.929 24.7159L17.644 20.0026L12.929 15.2893L15.2873 12.9309L20.0007 17.6459Z"
        fill="currentColor"
      />
    </svg>
  );
}
