import classnames from 'classnames';
import React, { useMemo } from 'react';
import sectionTagConst from './sectiontag.const';
import { type VariantTypoSize } from './types';

interface SectionTagTypes {
  className?: string;
  size?: VariantTypoSize;
  children?: React.ReactNode;
}

export default function SectionTag({
  className,
  size = 'small',
  children,
}: Partial<SectionTagTypes>) {
  const classes = useMemo(
    () =>
      classnames({
        [sectionTagConst.small]: size === 'small',
        [sectionTagConst.middle]: size === 'middle',
        [sectionTagConst.large]: size === 'large',
      }),
    [size],
  );

  return (
    <div className="flex gap-16px">
      <button
        className={classnames(
          'h-full border-1 border-solid border-pr_purple cursor-default font-manrope text-14 font-semibold leading-24 text-pr_purple',
          className,
          classes,
        )}
        type="button"
        data-tid="section-tag"
      >
        {children}
      </button>
    </div>
  );
}
