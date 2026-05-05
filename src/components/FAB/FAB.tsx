'use client';

import classNames from 'classnames';
import React from 'react';

export type FABPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';

export interface FABProps {
  /** Icon node rendered as the primary content. */
  icon: React.ReactNode;
  /** Optional text label. When extended is true, renders to the right of the icon. */
  label?: string;
  /** Where to anchor in the viewport. */
  position?: FABPosition;
  /**
   * When true and label is provided, expands to a pill shape with label text.
   * When false, renders only the icon (label still used for aria-label).
   */
  extended?: boolean;
  /** Pixel offset from the chosen edges. */
  offset?: number;
  /** Click handler. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Disabled state. */
  disabled?: boolean;
  /** Loading state — shows spinner and disables the button. */
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
}

function positionStyle(position: FABPosition, offset: number): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 'var(--z-popover)',
  };
  switch (position) {
    case 'bottom-right':
      return { ...base, bottom: offset, right: offset };
    case 'bottom-left':
      return { ...base, bottom: offset, left: offset };
    case 'top-right':
      return { ...base, top: offset, right: offset };
    case 'top-left':
      return { ...base, top: offset, left: offset };
  }
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function FAB({
  icon,
  label,
  position = 'bottom-right',
  extended = false,
  offset = 24,
  onClick,
  disabled = false,
  loading = false,
  className,
  'aria-label': ariaLabel,
}: FABProps) {
  const showLabel = extended && !!label;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel ?? label}
      aria-busy={loading || undefined}
      style={positionStyle(position, offset)}
      className={classNames(
        'flex items-center justify-center gap-8px font-manrope font-semibold text-14 text-white',
        'bg-pr_purple hover:bg-sec_purple shadow-3xl active:shadow-5xl',
        'transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pr_purple',
        showLabel ? 'rounded-circle h-[56px] px-20px' : 'rounded-full w-[56px] h-[56px]',
        className,
      )}
    >
      {loading ? <Spinner /> : <span className="flex items-center justify-center">{icon}</span>}
      {showLabel && <span>{label}</span>}
    </button>
  );
}

export default FAB;
