'use client';

import classNames from 'classnames';
import React from 'react';

export type KBDSize = 'xs' | 'sm' | 'md';

export interface KBDProps {
  /** Keys to render as separate chips, e.g. ['Cmd', 'K']. */
  keys: string[];
  /** Visual separator between chips. */
  separator?: '+' | '-' | ' ';
  /** Visual size. */
  size?: KBDSize;
  className?: string;
}

const sizeClasses: Record<KBDSize, string> = {
  xs: 'text-10 px-4px py-[1px] min-w-[16px] h-[16px]',
  sm: 'text-12 px-6px py-[2px] min-w-[20px] h-[20px]',
  md: 'text-14 px-8px py-[3px] min-w-[24px] h-[24px]',
};

const separatorSizeClasses: Record<KBDSize, string> = {
  xs: 'text-10 mx-2px',
  sm: 'text-12 mx-4px',
  md: 'text-14 mx-6px',
};

export function KBD({ keys, separator = '+', size = 'sm', className }: KBDProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center font-manrope text-fg-muted select-none align-middle',
        className,
      )}
      aria-label={keys.join(` ${separator === ' ' ? 'then' : separator} `)}
    >
      {keys.map((key, index) => (
        <React.Fragment key={`${key}-${index}`}>
          {index > 0 && separator !== ' ' && (
            <span className={classNames('text-fg-muted', separatorSizeClasses[size])} aria-hidden="true">
              {separator}
            </span>
          )}
          {index > 0 && separator === ' ' && (
            <span className={classNames('inline-block', separatorSizeClasses[size])} aria-hidden="true">
              {' '}
            </span>
          )}
          <kbd
            className={classNames(
              'inline-flex items-center justify-center rounded-[4px] border border-black_3 bg-black_2 text-fg-muted font-manrope font-medium leading-none',
              sizeClasses[size],
            )}
          >
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

export default KBD;
