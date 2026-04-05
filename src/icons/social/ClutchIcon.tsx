import type { SVGProps } from 'react';

interface IAttachIconProps extends SVGProps<SVGSVGElement> {
  color: string;
}

export default function ClutchIcon({ color, ...rest }: IAttachIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="32" height="32" rx="16" fill={color || 'white'} fillOpacity="0.04" />
      <path d="M20.5057 19.6735C19.5862 20.4082 18.2989 20.9592 17.0115 20.9592C14.069 20.9592 12.046 18.7551 12.046 15.8163C12.046 12.8775 14.069 10.8571 17.0115 10.8571C18.2989 10.8571 19.5862 11.2245 20.5057 12.1429L21.0575 12.6939L24 9.93877L23.2644 9.38775C21.6092 7.91836 19.4023 7 17.0115 7C11.8621 7 8 10.8571 8 16C8 21.1429 11.8621 25 17.0115 25C19.4023 25 21.6092 24.0816 23.2644 22.6122L24 22.0612L21.0575 19.1224L20.5057 19.6735Z" />
      <path d="M16.8275 18.9386C18.4527 18.9386 19.7701 17.6229 19.7701 15.9998C19.7701 14.3768 18.4527 13.061 16.8275 13.061C15.2024 13.061 13.885 14.3768 13.885 15.9998C13.885 17.6229 15.2024 18.9386 16.8275 18.9386Z" />
    </svg>
  );
}
