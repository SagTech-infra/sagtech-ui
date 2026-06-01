import React from 'react';

export type UIImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  [key: string]: unknown;
};

export type UIImageComponent = React.ComponentType<UIImageProps>;

export type UILinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  target?: string;
  rel?: string;
  [key: string]: unknown;
}>;

export type UILinkComponent = React.ComponentType<UILinkProps>;

export const DefaultImageShim: UIImageComponent = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  fill,
  ...rest
}) => {
  const imgStyle: React.CSSProperties = fill
    ? {
        objectFit: 'cover',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      }
    : style ?? {};

  return (
    <img
      src={src}
      alt={alt}
      width={width as number | undefined}
      height={height as number | undefined}
      className={className}
      style={imgStyle}
      {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};

DefaultImageShim.displayName = 'DefaultImageShim';

export const DefaultLinkShim: UILinkComponent = ({
  href,
  className,
  onClick,
  target,
  rel,
  children,
  ...rest
}) => (
  <a
    href={href}
    className={className}
    onClick={onClick}
    target={target}
    rel={rel}
    {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
  >
    {children}
  </a>
);

DefaultLinkShim.displayName = 'DefaultLinkShim';

export interface UIComponentsContextValue {
  imageComponent: UIImageComponent;
  linkComponent: UILinkComponent;
}
