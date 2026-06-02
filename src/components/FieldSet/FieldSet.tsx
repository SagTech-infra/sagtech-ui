"use client";

import { useId, type ReactNode, type Ref } from "react";
import classNames from "classnames";

export interface FieldSetProps {
  /** Group label rendered inside the native `<legend>`. */
  legend: ReactNode;
  /** Visually hide the legend while keeping it available to screen readers. */
  legendHidden?: boolean;
  /** Disables the whole group via the native `fieldset` `disabled` attribute. */
  disabled?: boolean;
  /** The grouped fields (radios, checkboxes, etc.). */
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLFieldSetElement>;
}

export default function FieldSet({
  legend,
  legendHidden = false,
  disabled = false,
  children,
  className,
  ref,
}: FieldSetProps) {
  const baseId = useId();
  const legendId = `${baseId}-legend`;

  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      aria-labelledby={legendId}
      className={classNames(
        "flex flex-col gap-16px rounded-16px border border-border-default p-24px",
        { "opacity-50": disabled },
        className,
      )}
    >
      <legend
        id={legendId}
        className={classNames(
          "font-manrope text-14 text-fg-primary",
          legendHidden ? "sr-only" : "mb-8px px-8px",
        )}
      >
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}
