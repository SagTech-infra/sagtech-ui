import React, { type TextareaHTMLAttributes, type DetailedHTMLProps, type Ref, useMemo } from 'react';
import classNames from 'classnames';
import textAreaStyles from './textarea.const';

interface TextAreaProps
  extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  state?: 'default' | 'active';
  classes?: string;
  disabled?: boolean;
  errorMessage?: string;
  isError?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextArea({
  state = 'default',
  value,
  classes,
  disabled,
  isError,
  errorMessage,
  ref,
  ...rest
}: TextAreaProps) {
  const textareaStyles = useMemo(
    () =>
      classNames({
        [textAreaStyles.basicStyles]: true,
        [textAreaStyles.defaultBorder]: state === 'default' && !isError,
        [textAreaStyles.defaultStyles]: state === 'default' && !isError,
        [textAreaStyles.disabledArea]: true,
        [textAreaStyles.activeArea]: state === 'active' && !isError,
        [textAreaStyles.errorArea]: isError,
      }),
    [isError, state],
  );

  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        className={`${textareaStyles} ${classes !== undefined ? classes : ''}`}
        disabled={disabled}
        {...rest}
      />
      {isError && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">{errorMessage}</p>
      )}
    </div>
  );
}

export default TextArea;
