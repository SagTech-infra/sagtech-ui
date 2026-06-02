"use client";

import { useId, type KeyboardEvent, type Ref } from "react";
import classNames from "classnames";
import inputConsts from "../Input/input.const";

export interface NumberInputProps {
  /** Controlled numeric value; use "" to represent an empty field. */
  value: number | "";
  /** Fires with the next numeric value after clamping/stepping. */
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Increment applied by steppers and ArrowUp/ArrowDown. */
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  /** Accessible label for the field; falls back to "Number input". */
  label?: string;
  className?: string;
  name?: string;
  ref?: Ref<HTMLInputElement>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** roundToStep avoids float drift like 0.1 * 3 = 0.30000000000000004. */
function roundToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  const steps = Math.round((value - min) / step);
  return parseFloat((min + steps * step).toFixed(10));
}

const stepperStyles =
  "flex h-[24px] w-[24px] items-center justify-center rounded-8px bg-grey_2 text-fg-primary leading-none transition-colors duration-200 hover:bg-grey_3 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple";

export default function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled = false,
  placeholder,
  label,
  className,
  name,
  ref,
}: NumberInputProps) {
  const id = useId();
  const current = value === "" ? null : value;

  const commit = (raw: number) => {
    if (disabled) return;
    const stepped = roundToStep(raw, Number.isFinite(min) ? min : 0, step);
    onChange(clamp(stepped, min, max));
  };

  const stepBy = (direction: 1 | -1) => {
    const base = current ?? (Number.isFinite(min) ? min : 0);
    commit(base + direction * step);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      stepBy(-1);
    }
  };

  const handleChange = (raw: string) => {
    if (disabled) return;
    if (raw === "" || raw === "-") {
      // Allow clearing; surface the lower bound (or 0) so state stays numeric.
      onChange(Number.isFinite(min) ? min : 0);
      return;
    }
    // Ignore non-numeric input — keep the previous value.
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    commit(parsed);
  };

  const atMin = current !== null && current <= min;
  const atMax = current !== null && current >= max;

  return (
    <div
      className={classNames(
        "relative inline-flex w-full items-center",
        { "opacity-50": disabled },
        className,
      )}
    >
      <input
        ref={ref}
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        role="spinbutton"
        aria-label={label ?? "Number input"}
        aria-valuenow={current ?? undefined}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className={classNames(
          inputConsts.basicStyles,
          inputConsts.disabledInput,
          inputConsts.defaultBorder,
          "pr-[60px] text-fg-primary placeholder:text-fg-muted",
        )}
      />
      <div className="absolute end-12px flex items-center gap-4px">
        <button
          type="button"
          aria-label="Decrement"
          disabled={disabled || atMin}
          onClick={() => stepBy(-1)}
          className={stepperStyles}
        >
          {"−"}
        </button>
        <button
          type="button"
          aria-label="Increment"
          disabled={disabled || atMax}
          onClick={() => stepBy(1)}
          className={stepperStyles}
        >
          {"+"}
        </button>
      </div>
    </div>
  );
}
