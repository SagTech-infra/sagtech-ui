'use client';

import classNames from 'classnames';
import React from 'react';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';
export type BannerPosition = 'top' | 'bottom';

export interface BannerProps {
  /** Visual variant. */
  variant?: BannerVariant;
  /** Optional bold title rendered above children. */
  title?: React.ReactNode;
  /** Body content. */
  children?: React.ReactNode;
  /** Optional action node rendered to the right (typically a Button). */
  action?: React.ReactNode;
  /** When true, render a close (×) button that calls onClose. */
  dismissible?: boolean;
  /** Called when the user clicks the dismiss button. */
  onClose?: () => void;
  /** Where the banner anchors when sticky is true. */
  position?: BannerPosition;
  /** Whether to position fixed at top/bottom of viewport. Default true. */
  sticky?: boolean;
  /** Optional icon override. Pass null to render without an icon. */
  icon?: React.ReactNode;
  className?: string;
  role?: 'alert' | 'status';
}

const variantClasses: Record<BannerVariant, string> = {
  info: 'border-pr_blue bg-pr_blue/15 text-sec_blue',
  success: 'border-success bg-success/15 text-success',
  warning: 'border-warning bg-warning/15 text-warning',
  error: 'border-error bg-error/15 text-error',
};

function DefaultIcon({ variant }: { variant: BannerVariant }) {
  if (variant === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="flex-shrink-0">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="flex-shrink-0">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="flex-shrink-0">
        <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8v4M10 14.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="flex-shrink-0">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5M10 6v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Banner({
  variant = 'info',
  title,
  children,
  action,
  dismissible = false,
  onClose,
  position = 'top',
  sticky = true,
  icon,
  className,
  role = variant === 'error' ? 'alert' : 'status',
}: BannerProps) {
  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      style={sticky ? { zIndex: 'var(--z-banner)' } : undefined}
      className={classNames(
        'w-full flex items-start gap-12px px-24px py-12px font-manrope border-solid',
        variantClasses[variant],
        sticky && 'fixed left-0 right-0',
        sticky && position === 'top' && 'top-0 border-b',
        sticky && position === 'bottom' && 'bottom-0 border-t',
        !sticky && (position === 'top' ? 'border-b' : 'border-t'),
        className,
      )}
    >
      {icon !== null && (
        <div className={classNames('flex-shrink-0', children ? 'pt-2px' : '')}>
          {icon ?? <DefaultIcon variant={variant} />}
        </div>
      )}
      <div className="flex-1 min-w-0 text-fg-primary">
        {title && (
          <div className="font-semibold text-14 leading-18 break-words">{title}</div>
        )}
        {children && (
          <div
            className={classNames('text-14 leading-18 text-fg-muted break-words', {
              'mt-4px': title,
            })}
          >
            {children}
          </div>
        )}
      </div>
      {action && <div className="flex-shrink-0 self-center">{action}</div>}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={onClose}
          className="flex-shrink-0 text-fg-muted hover:text-fg-primary cursor-pointer self-center"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Banner;
