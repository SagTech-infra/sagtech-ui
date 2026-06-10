"use client";

import { type LabelHTMLAttributes, type Ref } from "react";
import classNames from "classnames";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Associates the label with a form control by its id. */
  htmlFor?: string;
  /** Appends a subtle required asterisk after the label text. */
  required?: boolean;
  /** Mutes the label to mirror a disabled control. */
  disabled?: boolean;
  ref?: Ref<HTMLLabelElement>;
}

export default function Label({
  htmlFor,
  required = false,
  disabled = false,
  children,
  className,
  ref,
  ...rest
}: LabelProps) {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      data-disabled={disabled || undefined}
      className={classNames(
        "text-12 font-bold leading-18 text-fg-primary data-[disabled=true]:text-fg-muted data-[disabled=true]:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-4px text-error">
          *
        </span>
      )}
    </label>
  );
}
