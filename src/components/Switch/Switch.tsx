"use client";

import { useId, type Ref } from "react";
import classNames from "classnames";

export interface SwitchProps {
  /** Controlled on/off state. */
  checked?: boolean;
  /** Fires with the next state when toggled. */
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Primary label rendered beside the control. */
  label?: string;
  /** Secondary helper text, associated via aria-describedby. */
  description?: string;
  /** Side the label/description sit on relative to the control. */
  labelPosition?: "left" | "right";
  /** Forwarded to the underlying control for native submission. */
  name?: string;
  ref?: Ref<HTMLButtonElement>;
}

const trackSizeMap = {
  sm: "w-[36px] h-[20px]",
  md: "w-[44px] h-[24px]",
} as const;

const thumbSizeMap = {
  sm: "w-[16px] h-[16px]",
  md: "w-[20px] h-[20px]",
} as const;

const thumbTranslateMap = {
  sm: "translate-x-[18px]",
  md: "translate-x-[22px]",
} as const;

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  labelPosition = "right",
  name,
  ref,
}: SwitchProps) {
  const baseId = useId();
  const labelId = label ? `${baseId}-label` : undefined;
  const descId = description ? `${baseId}-desc` : undefined;

  const handleToggle = () => {
    if (!disabled) onChange?.(!checked);
  };

  const text =
    label || description ? (
      <span className="flex flex-col">
        {label && (
          <span id={labelId} className="font-manrope text-14 text-fg-primary">
            {label}
          </span>
        )}
        {description && (
          <span id={descId} className="font-manrope text-12 text-fg-muted">
            {description}
          </span>
        )}
      </span>
    ) : null;

  return (
    <div
      className={classNames("inline-flex items-center gap-8px", {
        "opacity-50": disabled,
        "flex-row-reverse": labelPosition === "left",
      })}
    >
      <button
        ref={ref}
        type="button"
        role="switch"
        name={name}
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descId}
        disabled={disabled}
        onClick={handleToggle}
        className={classNames(
          "relative rounded-circle transition-colors duration-200 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
          trackSizeMap[size],
          {
            "bg-pr_purple": checked,
            "bg-grey_2": !checked,
          },
        )}
      >
        <span
          className={classNames(
            "absolute top-[2px] left-[2px] bg-white rounded-[50%] transition-transform duration-200",
            thumbSizeMap[size],
            {
              [thumbTranslateMap[size]]: checked,
              "translate-x-0": !checked,
            },
          )}
        />
      </button>
      {text}
    </div>
  );
}
