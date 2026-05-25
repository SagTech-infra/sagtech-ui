'use client';

import { useState } from 'react';
import classNames from 'classnames';

export interface TabItem {
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** @deprecated Use `value`/`onValueChange` */
  defaultIndex?: number;
  className?: string;
  /** @deprecated Use `value`/`onValueChange` */
  onChange?: (index: number) => void;
  /** Controlled active index. When provided, component is controlled. */
  value?: number;
  /** Called when the active tab changes (controlled). */
  onValueChange?: (index: number) => void;
}

export default function Tabs({ items, defaultIndex = 0, className, onChange, value, onValueChange }: TabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const isControlled = value !== undefined;
  const activeIndex = isControlled ? value : internalIndex;

  const handleTabClick = (index: number) => {
    onValueChange?.(index);
    onChange?.(index);
    if (!isControlled) {
      setInternalIndex(index);
    }
  };

  return (
    <div className={classNames('flex flex-col', className)}>
      <div className="flex flex-wrap gap-8px">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleTabClick(index)}
            className={classNames(
              'leading-24 flex justify-center items-center text-14 px-16px py-7px rounded-circle transition-all duration-200 font-manrope cursor-pointer',
              {
                'bg-pr_purple border border-solid border-pr_purple text-white_4':
                  index === activeIndex,
                'border border-solid border-grey_4 text-grey_4 hover:border-white_4 hover:text-white_4':
                  index !== activeIndex,
              },
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={classNames('transition-opacity duration-200 col-start-1 row-start-1', {
              'opacity-100 visible': index === activeIndex,
              'opacity-0 invisible pointer-events-none': index !== activeIndex,
            })}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
