import React, { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';
import '@/tokens/index.css';
import { Icon } from '@/components/Icon/Icon';

interface AnimateType
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string;
}

export default function AnimationButton({ text = 'Some txt', ...rest }: AnimateType) {
  return (
    <div className="inline-block">
      <button
        type="button"
        className="buttonAnim buttonAnims items-center overflow-hidden rounded-circle bg-pr_purple cursor-pointer disabled:cursor-not-allowed"
        {...rest}
      >
        <div className="flex items-center ">
          <span className="animation whitespace-nowrap font-manrope font-bold leading-24 text-white">
            {text}
          </span>
          <div role="contentinfo" className="iconStyles">
            <Icon icon="arrow" size={32} viewBox="0 0 32 32" color="#6D3EF1" />
          </div>
        </div>
      </button>
    </div>
  );
}
