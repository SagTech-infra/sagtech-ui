'use client';

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { PhoneInput as PhoneInputEl, type PhoneInputProps, type CountryIso2 } from 'react-international-phone';
import 'react-international-phone/style.css';
import { detectCountry } from '@/utils/detectCountry';
import { mergeRefs } from '@/utils/mergeRefs';

function PhoneInput({
  error,
  label,
  ref,
  ...props
}: PhoneInputProps & {
  error?: boolean;
  label?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const [detectedCountry, setDetectedCountry] = useState<CountryIso2>('us');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    try {
      const country = detectCountry();
      setDetectedCountry(country);
    } catch (e) {
      console.warn('Failed to detect country, using US as fallback:', e);
      setDetectedCountry('us');
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDropdownWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={mergeRefs(containerRef, ref)} className="flex flex-col gap-6px">
      {label && (
        <label htmlFor={props.name} className="text-12 font-bold leading-18 text-fg-secondary">
          {label}
        </label>
      )}
      <PhoneInputEl
        countrySelectorStyleProps={{
          buttonClassName:
            'bg-transparent! border-0! border-r! border-solid! border-r-grey_2! rounded-l-16px! rounded-r-none! px-12px! h-full!',
          dropdownStyleProps: {
            className: 'bg-black_1! rounded-16px! z-50! custom-scrollbar',
            style: {
              boxShadow: `0 0 0 1px ${error ? '#992d2d' : '#6d3ef1'}`,
              outline: 'none',
              width: dropdownWidth ? `${dropdownWidth}px` : undefined,
            },
            listItemClassName:
              'px-12px! py-8px! text-14! cursor-pointer! hover:bg-black_2! text-fg-primary!',
            listItemCountryNameClassName: 'text-fg-primary!',
            listItemDialCodeClassName: 'text-fg-muted!',
          },
        }}
        inputClassName="bg-transparent! border-0! text-fg-primary! placeholder:text-grey_4 h-full! flex-1! text-14! focus:outline-none! focus:ring-0! px-16px!"
        className={classNames(
          'w-full bg-black_1! border! border-solid! rounded-16px! h-56px!',
          {
            'border-pr_purple!': !error,
            'border-error!': error,
          },
        )}
        defaultCountry={detectedCountry}
        key={error ? 'error' : 'no-error'}
        {...props}
      />
    </div>
  );
}

export default PhoneInput;
