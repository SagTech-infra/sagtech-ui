'use client';

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { PhoneInput as PhoneInputEl, type PhoneInputProps, type CountryIso2 } from 'react-international-phone';
import 'react-international-phone/style.css';
import { detectCountry } from '@/utils/detectCountry';

function PhoneInput({
  error,
  externalLabel,
  ref,
  ...props
}: PhoneInputProps & {
  error?: boolean;
  externalLabel?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const [detectedCountry, setDetectedCountry] = useState<CountryIso2>('us');

  useEffect(() => {
    try {
      const country = detectCountry();
      setDetectedCountry(country);
    } catch (e) {
      console.warn('Failed to detect country, using US as fallback:', e);
      setDetectedCountry('us');
    }
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-6px">
      {externalLabel && (
        <label htmlFor={props.name} className="text-12 font-bold leading-18 text-white_1">
          {externalLabel}
        </label>
      )}
      <PhoneInputEl
        countrySelectorStyleProps={{
          buttonClassName: classNames('!p-12px', {
            '!border-error': error,
          }),
        }}
        inputClassName={classNames('w-full', {
          '!border-error': error,
        })}
        className="w-full relative "
        defaultCountry={detectedCountry}
        key={error ? 'error' : 'no-error'}
        {...props}
      />
    </div>
  );
}

export default PhoneInput;
