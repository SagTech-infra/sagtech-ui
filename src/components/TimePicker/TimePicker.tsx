"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type Ref,
} from "react";
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

interface TimeSelectProps {
  value: number;
  options: number[];
  disabled?: boolean;
  ariaLabel: string;
  onChange: (value: number) => void;
}

const DROPDOWN_MAX_H = 200;
const DROPDOWN_W = 60;

function TimeSelect({
  value,
  options,
  disabled,
  ariaLabel,
  onChange,
}: TimeSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow >= DROPDOWN_MAX_H + 4
        ? rect.bottom + 4
        : rect.top - DROPDOWN_MAX_H - 4;

    setPos({ top, left: rect.left });
    setOpen(true);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);

    function handleMouseDown(e: MouseEvent) {
      if (
        !listRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        close();
      }
    }

    // Ignore scroll events that originate inside the dropdown list itself
    // (e.g. scrollIntoView triggering a scroll on listRef) — only close
    // when something outside the list scrolls.
    function handleScroll(e: Event) {
      if (listRef.current?.contains(e.target as Node)) return;
      close();
    }

    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // Scroll selected item into view when list opens
  useEffect(() => {
    if (!open || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(
      "[data-selected=true]",
    );
    active?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={openDropdown}
        className={classNames(
          "bg-black_1 border border-solid rounded-8px text-white_4 text-14 font-manrope px-8px py-4px cursor-pointer",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open
            ? "border-pr_purple"
            : "border-black_3 hover:border-sec_purple",
        )}
      >
        {String(value).padStart(2, "0")}
      </button>

      {open && pos && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: DROPDOWN_W,
            maxHeight: DROPDOWN_MAX_H,
            zIndex: 9999,
          }}
          className="custom-scrollbar overflow-y-auto bg-black_1 border border-solid border-black_3 rounded-8px py-4px"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <div
                key={opt}
                role="option"
                aria-selected={selected}
                data-selected={selected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                }}
                className={classNames(
                  "px-8px py-4px text-14 font-manrope cursor-pointer text-center",
                  selected
                    ? "bg-pr_purple text-white_4"
                    : "text-white_4 hover:bg-black_3",
                )}
              >
                {String(opt).padStart(2, "0")}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

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

  const safeStep = Math.min(Math.max(Math.floor(step) || 1, 1), 60);
  const minuteOptions = useMemo(
    () =>
      Array.from({ length: Math.ceil(60 / safeStep) }, (_, i) => i * safeStep),
    [safeStep],
  );
  const hourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, h) => h),
    [],
  );

  const selectedMinute = minutes - (minutes % safeStep);

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
        <TimeSelect
          ariaLabel="Hours"
          value={hours}
          options={hourOptions}
          disabled={disabled}
          onChange={(h) => onChange?.({ hours: h, minutes })}
        />
        <span className="text-grey_4">:</span>
        <TimeSelect
          ariaLabel="Minutes"
          value={selectedMinute}
          options={minuteOptions}
          disabled={disabled}
          onChange={(m) => onChange?.({ hours, minutes: m })}
        />
      </div>
    </div>
  );
}
