'use client';

import { useState } from 'react';
import classNames from 'classnames';

export interface TabItem {
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  className?: string;
  onChange?: (index: number) => void;
}

export default function Tabs({ items, defaultIndex = 0, className, onChange }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      onChange?.(index);
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
