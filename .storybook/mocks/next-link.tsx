import React from 'react';

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  [key: string]: unknown;
};

const Link = ({ href, children, className, ...rest }: LinkProps) => (
  <a href={href} className={className} {...rest}>
    {children}
  </a>
);

export default Link;
