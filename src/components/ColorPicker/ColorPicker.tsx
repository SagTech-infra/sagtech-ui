"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type Ref,
} from "react";
import classNames from "classnames";
import Popover from "../Popover/Popover";
import Slider from "../Slider/Slider";
import {
  hexAlpha,
  hexToHsl,
  hslToHex,
  normalizeHex,
  toCssColor,
  withAlpha,
  type Hsl,
} from "./color";

export interface ColorPickerProps {
  /** Current color as #RRGGBB, or #RRGGBBAA when `alpha` is enabled. */
  value: string;
  /** Emits a normalized hex string whenever the color changes. */
  onChange: (hex: string) => void;
  /** Render an alpha channel slider and emit #RRGGBBAA. */
  alpha?: boolean;
  /** Preset colors shown as a clickable grid. */
  swatches?: string[];
  disabled?: boolean;
  label?: string;
  name?: string;
  ref?: Ref<HTMLDivElement>;
}

export const DEFAULT_SWATCHES: string[] = [
  "#000000",
  "#FFFFFF",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#22C55E",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
];

const HUE_MAX = 360;
const PERCENT_MAX = 100;

function deriveState(value: string, alpha: boolean): { hsl: Hsl; alpha: number } {
  const hsl = hexToHsl(value) ?? { h: 0, s: 0, l: 0 };
  return { hsl, alpha: alpha ? hexAlpha(value) : PERCENT_MAX };
}

export default function ColorPicker({
  value,
  onChange,
  alpha = false,
  swatches = DEFAULT_SWATCHES,
  disabled = false,
  label,
  name,
  ref,
}: ColorPickerProps) {
  const id = useId();

  // Controlled-first: HSL + alpha are derived from `value` on every render.
  const { hsl, alpha: alphaValue } = useMemo(
    () => deriveState(value, alpha),
    [value, alpha],
  );

  // Local buffer for the hex text input so typing invalid chars
  // doesn't immediately clobber the controlled value.
  const [hexDraft, setHexDraft] = useState(value);
  useEffect(() => {
    setHexDraft(value);
  }, [value]);

  const emitFromHsl = useCallback(
    (next: Hsl) => {
      const base = hslToHex(next);
      onChange(alpha ? withAlpha(base, alphaValue) : base);
    },
    [alpha, alphaValue, onChange],
  );

  const handleHue = useCallback(
    (h: number) => emitFromHsl({ ...hsl, h }),
    [emitFromHsl, hsl],
  );
  const handleSat = useCallback(
    (s: number) => emitFromHsl({ ...hsl, s }),
    [emitFromHsl, hsl],
  );
  const handleLight = useCallback(
    (l: number) => emitFromHsl({ ...hsl, l }),
    [emitFromHsl, hsl],
  );
  const handleAlpha = useCallback(
    (a: number) => {
      const base = hslToHex(hsl);
      onChange(withAlpha(base, a));
    },
    [hsl, onChange],
  );

  const commitHex = useCallback(() => {
    const normalized = normalizeHex(hexDraft, alpha);
    if (normalized) {
      onChange(normalized);
    } else {
      // Reject invalid input by reverting the draft to the controlled value.
      setHexDraft(value);
    }
  }, [hexDraft, alpha, onChange, value]);

  const handleHexChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHexDraft(event.target.value);
  };

  const handleHexKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitHex();
    }
  };

  // When alpha is enabled, a swatch without its own alpha channel is treated
  // as fully opaque (#RRGGBB -> #RRGGBBFF) so the grid always emits 8 digits.
  const resolveSwatch = useCallback(
    (swatch: string): string | null => {
      const normalized = normalizeHex(swatch, alpha);
      if (!normalized) return null;
      if (alpha && normalized.length === 7) return `${normalized}FF`;
      return normalized;
    },
    [alpha],
  );

  const handleSwatch = useCallback(
    (swatch: string) => {
      const resolved = resolveSwatch(swatch);
      if (resolved) onChange(resolved);
    },
    [resolveSwatch, onChange],
  );

  const swatchCss = toCssColor(value, alpha);

  const trigger = (
    <span
      className={classNames(
        "inline-flex items-center gap-8px rounded-12px border border-border-default bg-bg-secondary px-12px py-8px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
    >
      <span
        aria-hidden="true"
        className="h-20px w-20px rounded-8px border border-border-default"
        style={{ backgroundColor: swatchCss }}
      />
      <span className="font-manrope text-14 text-fg-primary uppercase">
        {value}
      </span>
    </span>
  );

  const panel = (
    <div className="flex w-[260px] flex-col gap-8px" data-testid="colorpicker-panel">
      <Slider
        label="Hue"
        min={0}
        max={HUE_MAX}
        step={1}
        value={hsl.h}
        onChange={handleHue}
        disabled={disabled}
      />
      <Slider
        label="Saturation"
        min={0}
        max={PERCENT_MAX}
        step={1}
        value={hsl.s}
        onChange={handleSat}
        disabled={disabled}
      />
      <Slider
        label="Lightness"
        min={0}
        max={PERCENT_MAX}
        step={1}
        value={hsl.l}
        onChange={handleLight}
        disabled={disabled}
      />
      {alpha && (
        <Slider
          label="Alpha"
          min={0}
          max={PERCENT_MAX}
          step={1}
          value={alphaValue}
          onChange={handleAlpha}
          disabled={disabled}
        />
      )}

      <label
        htmlFor={`${id}-hex`}
        className="font-manrope text-12 text-fg-muted"
      >
        Hex
      </label>
      <input
        id={`${id}-hex`}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        spellCheck={false}
        value={hexDraft}
        disabled={disabled}
        onChange={handleHexChange}
        onBlur={commitHex}
        onKeyDown={handleHexKeyDown}
        aria-label="Hex color value"
        className={classNames(
          "rounded-12px border border-border-default bg-bg-secondary px-12px py-8px",
          "font-manrope text-14 text-fg-primary uppercase",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />

      {swatches.length > 0 && (
        <div
          className="mt-8px grid grid-cols-6 gap-8px"
          role="group"
          aria-label="Preset colors"
        >
          {swatches.map((swatch) => {
            const resolved = resolveSwatch(swatch) ?? swatch;
            const selected = normalizeHex(value, alpha) === resolved;
            return (
              <button
                key={swatch}
                type="button"
                disabled={disabled}
                onClick={() => handleSwatch(swatch)}
                aria-label={`Select color ${resolved}`}
                aria-pressed={selected}
                className={classNames(
                  "h-24px w-24px rounded-8px border",
                  selected ? "border-pr_purple" : "border-border-default",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                )}
                style={{ backgroundColor: toCssColor(swatch, alpha) }}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div ref={ref} className="inline-flex flex-col gap-8px">
      {label && (
        <span
          id={`${id}-label`}
          className="font-manrope text-14 text-fg-primary"
        >
          {label}
        </span>
      )}
      {disabled ? (
        trigger
      ) : (
        <Popover trigger={trigger} position="bottom" align="start">
          {panel}
        </Popover>
      )}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
