import classNames from 'classnames';
import type { HTMLAttributes } from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  /** Tag to render; defaults to `div`. */
  as?: 'div' | 'section' | 'main' | 'article';
}

const sizeMap: Record<ContainerSize, string> = {
  sm: 'max-w-[640px]',
  md: 'max-w-[960px]',
  lg: 'max-w-[1200px]',
  xl: 'max-w-[1440px]',
  full: 'max-w-none',
};

export default function Container({
  size = 'md',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={classNames('w-full mx-auto px-16px sm:px-24px', sizeMap[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
