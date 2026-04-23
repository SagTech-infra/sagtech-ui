import { useMemo } from 'react';
import classNames from 'classnames';
import buttonConst from './button.const';
import type { ButtonTypes } from './Button';

const useButtonStyles = ({
  variant,
  stateOfButton,
  disabled,
  loadingType,
  changeColor,
  buttonSize,
  hoverOff,
}: ButtonTypes) =>
  useMemo(
    () =>
      classNames({
        [buttonConst.tabButtonActive]:
          variant === 'tabButton' && stateOfButton === 'active' && !disabled,
        [buttonConst.tabButtonDefault]:
          (variant === 'tabButton' || variant === 'tabButtonWhite') &&
          stateOfButton === 'default' &&
          !disabled,
        [buttonConst.primaryButton]: variant === 'primary' && loadingType !== true,
        [buttonConst.primaryButtonTextColor]:
          variant === 'primary' && loadingType !== true && !changeColor,
        [buttonConst.primaryButtonNewColor]:
          variant === 'primary' && loadingType !== true && changeColor,
        [buttonConst.tabButtonBase]: variant === 'tabButton',
        [buttonConst.secondaryButton]: variant === 'secondary' && loadingType !== true,
        [buttonConst.dangerButton]: variant === 'danger' && loadingType !== true,
        [buttonConst.hoverAnimation]:
          !(disabled ?? false) &&
          variant === 'primary' &&
          loadingType !== true &&
          !hoverOff,
        [buttonConst.secondaryAnimation]:
          variant === 'secondary' &&
          buttonSize === 'large' &&
          !(disabled ?? false) &&
          loadingType !== true,
        [buttonConst.dangerAnimation]:
          variant === 'danger' &&
          !(disabled ?? false) &&
          loadingType !== true &&
          !hoverOff,
        [buttonConst.dangerDisabledStyles]: variant === 'danger' && disabled,
        [buttonConst.loadingDanger]: variant === 'danger' && loadingType,
        [buttonConst.tabButtonHover]: variant === 'tabButton' && stateOfButton !== 'active',
        [buttonConst.basicStyles]: variant !== 'tabButton',
        [buttonConst.primaryDisabledStyles]: variant === 'primary',
        [buttonConst.loadingPrimary]: variant === 'primary' && loadingType,
        [buttonConst.tabButtonDisabled]: variant === 'tabButton' && disabled,
        [buttonConst.secondaryDisabledStyles]: variant === 'secondary' && disabled,
        [buttonConst.loadingSecondary]: variant === 'secondary' && loadingType,
        [buttonConst.smallSize]: buttonSize === 'small',
        [buttonConst.largeSize]: buttonSize === 'large',
        [buttonConst.tabButtonWhiteBase]: variant === 'tabButtonWhite',
        [buttonConst.tabButtonWhiteHover]:
          variant === 'tabButtonWhite' && stateOfButton !== 'active',
      }),
    [variant, stateOfButton, disabled, loadingType, changeColor, buttonSize, hoverOff],
  );

export default useButtonStyles;
