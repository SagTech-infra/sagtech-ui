'use client';

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  role?: 'alert' | 'status';
  /**
   * Optional auto-dismiss timer in milliseconds. When set and `onClose` is
   * provided, the alert will fire `onClose` after the duration. The timer is
   * paused while the user hovers the alert. Default: undefined (no auto-dismiss).
   */
  autoDismiss?: number;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-pr_blue bg-pr_blue/10 text-sec_blue',
  success: 'border-success bg-success/10 text-success',
  warning: 'border-warning bg-warning/10 text-warning',
  error: 'border-error bg-error/10 text-error',
};

function DefaultIcon({ variant }: { variant: AlertVariant }) {
  if (variant === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
        <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8v4M10 14.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5M10 6v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Alert({
  variant = 'info',
  title,
  children,
  icon,
  action,
  onClose,
  className,
  role = variant === 'error' ? 'alert' : 'status',
  autoDismiss,
}: AlertProps) {
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoDismiss || autoDismiss <= 0 || !onClose) return;
    if (paused) return;
    timerRef.current = setTimeout(() => {
      onClose();
    }, autoDismiss);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoDismiss, paused, onClose]);

  const hoverHandlers =
    autoDismiss && onClose
      ? {
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
        }
      : {};

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={classNames(
        'flex gap-10px rounded-8px border border-solid px-12px py-10px font-manrope',
        children ? 'items-start' : 'items-center',
        variantClasses[variant],
        className,
      )}
      {...hoverHandlers}
    >
      <div className={classNames('shrink-0', children ? 'pt-2px' : '')}>
        {icon ?? <DefaultIcon variant={variant} />}
      </div>
      <div className="flex-1 min-w-0 text-fg-primary">
        {title && (
          <div className="font-semibold text-14 leading-18 wrap-break-word">{title}</div>
        )}
        {children && (
          <div
            className={classNames('text-14 leading-18 text-fg-muted wrap-break-word', {
              'mt-4px': title,
            })}
          >
            {children}
          </div>
        )}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={onClose}
          className="shrink-0 text-fg-muted hover:text-fg-primary cursor-pointer self-start"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
