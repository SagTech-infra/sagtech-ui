"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type Ref,
} from "react";
import classNames from "classnames";
import { useLocale } from "@/providers/LocaleContext";

export interface SliderMark {
  value: number;
  label?: string;
}

interface SliderBaseProps {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  marks?: SliderMark[];
  label?: string;
  name?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value: number;
  onChange: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  const steps = Math.round((value - min) / step);
  // toFixed avoids float drift like 0.1 * 3 = 0.30000000000000004
  return parseFloat((min + steps * step).toFixed(10));
}

function percent(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export default function Slider(props: SliderProps) {
  const {
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    marks,
    label,
    name,
    ref,
  } = props;

  const isRange = props.range === true;
  const { value } = props;
  const values = useMemo<number[]>(
    () => (Array.isArray(value) ? [value[0], value[1]] : [value]),
    [value],
  );

  const { dir } = useLocale();
  const isRtl = dir === "rtl";

  const id = useId();
  const labelId = label ? `${id}-label` : undefined;
  const trackRef = useRef<HTMLDivElement>(null);

  const pageStep = Math.max(step, (max - min) / 10);

  const emit = useCallback(
    (next: number[]) => {
      if (isRange) {
        (props.onChange as (value: [number, number]) => void)([
          next[0],
          next[1],
        ]);
      } else {
        (props.onChange as (value: number) => void)(next[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRange, props.onChange],
  );

  const commitThumb = useCallback(
    (thumbIndex: number, rawValue: number) => {
      const stepped = roundToStep(rawValue, min, step);
      const bounded = clamp(stepped, min, max);
      let clamped = bounded;

      if (isRange) {
        clamped =
          thumbIndex === 0
            ? Math.min(bounded, values[1])
            : Math.max(bounded, values[0]);
      }

      if (clamped === values[thumbIndex]) return;

      const next = [...values];
      next[thumbIndex] = clamped;
      emit(next);
    },
    [emit, isRange, max, min, step, values],
  );

  // Keep the latest commitThumb reachable from the imperative pointermove
  // listener, which is registered once per drag and would otherwise close over
  // a stale `values` (letting range thumbs cross during a fast drag).
  const commitThumbRef = useRef(commitThumb);
  commitThumbRef.current = commitThumb;

  const nextForKey = (key: string, current: number): number | null => {
    switch (key) {
      case "ArrowLeft":
        return current + (isRtl ? step : -step);
      case "ArrowDown":
        return current - step;
      case "ArrowRight":
        return current + (isRtl ? -step : step);
      case "ArrowUp":
        return current + step;
      case "Home":
        return min;
      case "End":
        return max;
      case "PageDown":
        return current - pageStep;
      case "PageUp":
        return current + pageStep;
      default:
        return null;
    }
  };

  const handleKeyDown = (thumbIndex: number) => (event: KeyboardEvent) => {
    if (disabled) return;

    const next = nextForKey(event.key, values[thumbIndex]);
    if (next === null) return;

    event.preventDefault();
    commitThumb(thumbIndex, next);
  };

  const valueFromPointer = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      if (rect.width === 0) return min;
      let ratio = (clientX - rect.left) / rect.width;
      if (isRtl) ratio = 1 - ratio;
      ratio = clamp(ratio, 0, 1);
      return min + ratio * (max - min);
    },
    [isRtl, max, min],
  );

  const nearestThumb = useCallback(
    (value: number): number => {
      if (!isRange) return 0;
      const d0 = Math.abs(value - values[0]);
      const d1 = Math.abs(value - values[1]);
      return d0 <= d1 ? 0 : 1;
    },
    [isRange, values],
  );

  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rawValue = valueFromPointer(event.clientX);
    const thumbIndex = nearestThumb(rawValue);
    commitThumb(thumbIndex, rawValue);
  };

  const handleThumbPointerDown =
    (thumbIndex: number) => (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.stopPropagation();
      const thumb = event.currentTarget;
      thumb.setPointerCapture(event.pointerId);

      const move = (moveEvent: globalThis.PointerEvent) => {
        commitThumbRef.current(thumbIndex, valueFromPointer(moveEvent.clientX));
      };
      const up = (upEvent: globalThis.PointerEvent) => {
        thumb.releasePointerCapture(upEvent.pointerId);
        thumb.removeEventListener("pointermove", move);
        thumb.removeEventListener("pointerup", up);
      };
      thumb.addEventListener("pointermove", move);
      thumb.addEventListener("pointerup", up);
    };

  const lowPct = isRange ? percent(values[0], min, max) : 0;
  const highPct = isRange
    ? percent(values[1], min, max)
    : percent(values[0], min, max);

  const startSide = isRtl ? "right" : "left";
  const fillStart = isRange ? lowPct : 0;
  const fillSize = highPct - fillStart;

  return (
    <div
      ref={ref}
      dir={dir}
      className={classNames("flex flex-col gap-8px w-full select-none", {
        "opacity-50 pointer-events-none": disabled,
      })}
    >
      {label && (
        <span id={labelId} className="font-manrope text-14 text-fg-primary">
          {label}
        </span>
      )}

      <div className="relative w-full py-12px">
        {/* rail */}
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          className={classNames(
            "relative h-[4px] w-full rounded-circle bg-grey_2",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          {/* active fill */}
          <div
            className="absolute top-0 h-full rounded-circle bg-pr_purple"
            style={{ [startSide]: `${fillStart}%`, width: `${fillSize}%` }}
          />

          {/* marks */}
          {marks?.map((mark) => {
            const markPct = percent(mark.value, min, max);
            return (
              <div
                key={mark.value}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ [startSide]: `${markPct}%` }}
                data-testid="slider-mark"
              >
                <span className="block h-[8px] w-[2px] -translate-x-1/2 rounded-circle bg-grey_3" />
                {mark.label && (
                  <span className="absolute top-[12px] left-1/2 -translate-x-1/2 whitespace-nowrap font-manrope text-12 text-fg-muted">
                    {mark.label}
                  </span>
                )}
              </div>
            );
          })}

          {/* thumbs */}
          {values.map((value, index) => {
            const valuePct = percent(value, min, max);
            const minBound = isRange && index === 1 ? values[0] : min;
            const maxBound = isRange && index === 0 ? values[1] : max;
            return (
              <div
                key={index}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-orientation="horizontal"
                aria-valuemin={minBound}
                aria-valuemax={maxBound}
                aria-valuenow={value}
                aria-disabled={disabled || undefined}
                aria-label={
                  isRange
                    ? `${label ?? "Value"} ${index === 0 ? "minimum" : "maximum"}`
                    : !labelId
                      ? label
                      : undefined
                }
                aria-labelledby={isRange ? undefined : labelId}
                onKeyDown={handleKeyDown(index)}
                onPointerDown={handleThumbPointerDown(index)}
                style={{ [startSide]: `${valuePct}%` }}
                className={classNames(
                  "absolute top-1/2 h-[16px] w-[16px] -translate-y-1/2 -translate-x-1/2 rounded-circle border-2 border-pr_purple bg-white shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
                  disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* hidden form inputs */}
      {name &&
        values.map((value, index) => (
          <input
            key={index}
            type="hidden"
            name={isRange ? `${name}[${index}]` : name}
            value={value}
          />
        ))}
    </div>
  );
}
