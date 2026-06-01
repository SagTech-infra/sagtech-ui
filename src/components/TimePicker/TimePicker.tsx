"use client";

import { useMemo, type Ref } from "react";
import classNames from "classnames";

export interface TimeValue {
  hours: number;
  minutes: number;
}

export interface TimePickerProps {
  value?: TimeValue;
  onChange?: (value: TimeValue) => void;
  /** Minute granularity. Defaults to 5. */
  step?: number;
  disabled?: boolean;
  /** Leading label affordance. Defaults to "Time". */
  label?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const SELECT_CLASS =
  "bg-black_1 border border-solid border-black_3 rounded-8px text-white_4 text-14 font-manrope px-8px py-4px cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export default function TimePicker({
  value,
  onChange,
  step = 5,
  disabled = false,
  label = "Time",
  className,
  ref,
}: TimePickerProps) {
  const hours = value?.hours ?? 0;
  const minutes = value?.minutes ?? 0;

  const minuteOptions = useMemo(
    () =>
      Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step),
    [step],
  );

  // Snap the displayed minute to the nearest lower step so a controlled value
  // off the step grid still selects a valid option.
  const selectedMinute = minutes - (minutes % step);

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.({ hours: parseInt(e.target.value, 10), minutes });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.({ hours, minutes: parseInt(e.target.value, 10) });
  };

  return (
    <div
      ref={ref}
      className={classNames(
        "mt-12px pt-12px border-t border-solid border-black_3 flex items-center justify-between gap-12px",
        className,
      )}
    >
      {label && (
        <span className="font-manrope text-12 font-semibold text-grey_4">
          {label}
        </span>
      )}
      <div className="flex items-center gap-4px">
        <select
          aria-label="Hours"
          className={SELECT_CLASS}
          value={hours}
          disabled={disabled}
          onChange={handleHoursChange}
        >
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-grey_4">:</span>
        <select
          aria-label="Minutes"
          className={SELECT_CLASS}
          value={selectedMinute}
          disabled={disabled}
          onChange={handleMinutesChange}
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
