'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useLinkComponent } from '@/providers';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  variant?: NotificationVariant;
  timestamp?: Date | string | number;
  read?: boolean;
  href?: string;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onClearAll?: () => void;
  emptyMessage?: string;
  className?: string;
  position?: 'right' | 'left';
  label?: string;
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VariantIcon({ variant }: { variant: NotificationVariant }) {
  const colorClass =
    variant === 'success'
      ? 'text-success'
      : variant === 'error'
        ? 'text-error'
        : variant === 'warning'
          ? 'text-warning'
          : 'text-sec_blue';

  if (variant === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={classNames('flex-shrink-0', colorClass)} aria-hidden="true">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={classNames('flex-shrink-0', colorClass)} aria-hidden="true">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={classNames('flex-shrink-0', colorClass)} aria-hidden="true">
        <path d="M10 2l8 15H2L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8v4M10 14.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={classNames('flex-shrink-0', colorClass)} aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5M10 6v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function formatRelative(timestamp: Date | string | number): string {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const abs = Math.abs(diffMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (abs < minute) return 'just now';
  try {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    if (abs < hour) return rtf.format(Math.round(diffMs / minute), 'minute');
    if (abs < day) return rtf.format(Math.round(diffMs / hour), 'hour');
    if (abs < week) return rtf.format(Math.round(diffMs / day), 'day');
    return rtf.format(Math.round(diffMs / week), 'week');
  } catch {
    return date.toLocaleDateString();
  }
}

export default function NotificationCenter({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
  onClearAll,
  emptyMessage = 'No notifications yet',
  className,
  position = 'right',
  label = 'Notifications',
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const Link = useLinkComponent();

  const computedUnread =
    unreadCount ?? notifications.filter((n) => !n.read).length;

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      handleClose();
    };
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [isOpen, handleClose]);

  const handleItemActivate = (notification: NotificationItem) => {
    if (!notification.read) onMarkRead?.(notification.id);
    onNotificationClick?.(notification);
    handleClose();
  };

  const renderItem = (notification: NotificationItem) => {
    const variant = notification.variant ?? 'info';
    const inner = (
      <div className="flex items-start gap-12px w-full text-left">
        <VariantIcon variant={variant} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-8px">
            <span
              className={classNames(
                'flex-1 font-manrope text-14 font-semibold break-words',
                notification.read ? 'text-grey_4' : 'text-white_4',
              )}
            >
              {notification.title}
            </span>
            {!notification.read && (
              <span
                aria-label="Unread"
                className="w-[8px] h-[8px] rounded-[50%] bg-pr_purple mt-6px flex-shrink-0"
              />
            )}
          </div>
          {notification.description && (
            <p className="font-manrope text-12 text-grey_4 mt-2px break-words">
              {notification.description}
            </p>
          )}
          {notification.timestamp && (
            <span className="font-manrope text-10 text-grey_2 mt-4px block">
              {formatRelative(notification.timestamp)}
            </span>
          )}
        </div>
      </div>
    );

    const rowClasses = classNames(
      'block w-full text-left px-16px py-12px transition-colors border-b border-solid border-black_3',
      'hover:bg-black_2 focus:bg-black_2 outline-none',
      !notification.read && 'bg-pr_purple/5',
    );

    if (notification.href) {
      return (
        <Link
          key={notification.id}
          href={notification.href}
          className={rowClasses}
          onClick={() => handleItemActivate(notification)}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        key={notification.id}
        type="button"
        onClick={() => handleItemActivate(notification)}
        className={classNames(rowClasses, 'cursor-pointer')}
      >
        {inner}
      </button>
    );
  };

  return (
    <div ref={containerRef} className={classNames('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${label}${computedUnread > 0 ? `, ${computedUnread} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((v) => !v)}
        className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[50%] text-grey_4 hover:text-white_4 hover:bg-black_2 cursor-pointer transition-colors"
      >
        <BellIcon />
        {computedUnread > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-6px right-6px min-w-[16px] h-[16px] px-4px rounded-[50px] bg-error text-white text-10 font-manrope font-bold flex items-center justify-center"
          >
            {computedUnread > 99 ? '99+' : computedUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={label}
          className={classNames(
            'absolute mt-8px w-[360px] max-h-[480px] flex flex-col bg-black_1 border border-solid border-black_3 rounded-16px shadow-6xl overflow-hidden',
            position === 'right' ? 'right-0' : 'left-0',
          )}
          style={{ zIndex: 1000 }}
        >
          <header className="flex items-center justify-between px-16px py-12px border-b border-solid border-black_3">
            <span className="font-manrope text-14 font-bold text-white_4">{label}</span>
            <div className="flex items-center gap-8px">
              {onMarkAllRead && computedUnread > 0 && (
                <button
                  type="button"
                  onClick={() => onMarkAllRead()}
                  className="text-12 font-manrope text-pr_purple hover:text-sec_purple cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              {onClearAll && notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => onClearAll()}
                  className="text-12 font-manrope text-grey_4 hover:text-white_4 cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </header>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-48px px-24px">
                <BellIcon />
                <p className="font-manrope text-14 text-grey_2 mt-12px">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              notifications.map(renderItem)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
