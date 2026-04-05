import React from 'react';

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  [key: string]: unknown;
};

const Image = ({ src, alt, width, height, className, style, fill, ...rest }: ImageProps) => {
  const imgStyle: React.CSSProperties = fill
    ? { objectFit: 'cover', position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }
    : { ...style };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={imgStyle}
      {...rest}
    />
  );
};

export default Image;
