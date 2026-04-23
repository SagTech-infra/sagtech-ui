'use client';

import classNames from 'classnames';
import React from 'react';

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

export default function Alert({
  variant = 'info',
  title,
  children,
  icon,
  action,
  onClose,
  className,
  role = variant === 'error' ? 'alert' : 'status',
}: AlertProps) {
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
    >
      <div className={children ? 'pt-2px' : ''}>
        {icon ?? <DefaultIcon variant={variant} />}
      </div>
      <div className="flex-1 min-w-0 text-white_4">
        {title && (
          <div className="font-semibold text-14 leading-18 break-words">{title}</div>
        )}
        {children && (
          <div
            className={classNames('text-14 leading-18 text-grey_4 break-words', {
              'mt-4px': title,
            })}
          >
            {children}
          </div>
        )}
      </div>
      {action && <div className="flex-shrink-0 self-center">{action}</div>}
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={onClose}
          className="flex-shrink-0 text-grey_4 hover:text-white_4 cursor-pointer self-start"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
