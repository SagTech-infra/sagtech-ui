import React, { useMemo } from 'react';
import type { MouseEventHandler, ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Icon } from '@/components/Icon/Icon';
import type { VariantTypoTagsStyles } from '@/components/Typography/types';
import Typography from '@/components/Typography/Typography';
import useButtonStyles from './useButtonStyles';

export interface ButtonTypes
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  loadingType?: boolean;
  text?: string;
  buttonSize?: 'small' | 'large' | 'tabSize';
  variant?: 'primary' | 'secondary' | 'tabButton' | 'tabButtonWhite';
  useIcon?: boolean;
  stateOfButton?: 'default' | 'active';
  classes?: string;
  hoverOff?: boolean;
  changeColor?: boolean;
  children?: React.ReactNode;
  typeText?: VariantTypoTagsStyles;
  onClick?: MouseEventHandler;
}

export default function Button({
  text,
  disabled,
  buttonSize = 'large',
  loadingType,
  classes,
  variant,
  useIcon,
  stateOfButton = 'default',
  hoverOff,
  children,
  changeColor,
  typeText = 'Buttons',
  onClick,
  type = 'button',
  ...rest
}: ButtonTypes) {
  const buttonClasses = useButtonStyles({
    variant,
    stateOfButton,
    disabled,
    loadingType,
    changeColor,
    buttonSize,
    hoverOff,
  });

  const iconComponent = useMemo(() => {
    if (useIcon) {
      return (
        <Icon icon="arrow" size={buttonSize === 'small' ? 18 : 24} />
      );
    }
    return null;
  }, [useIcon, buttonSize]);

  return (
    <button
      type={type}
      className={`${classes} ${buttonClasses}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
      {loadingType && (
        <svg
          className="animate-spin"
          width={buttonSize === 'small' ? 16 : 20}
          height={buttonSize === 'small' ? 16 : 20}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {iconComponent}
      <Typography type={typeText} color="text-white" className="hidde-paragraph">
        {text}
      </Typography>
    </button>
  );
}
