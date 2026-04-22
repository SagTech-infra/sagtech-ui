import type { ReactNode } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastAction {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  /** Auto-dismiss delay in ms. `Infinity` disables auto-dismiss. Default: 4000 for info/success/default, 6000 for error/warning, Infinity for loading. */
  duration?: number;
  /** Primary action rendered inside the toast. */
  action?: ToastAction;
  /** Called when the toast is removed (by timeout, user action, or dismiss()). */
  onDismiss?: (id: string | number) => void;
  variant?: ToastVariant;
  /** Replace any visible toast with the same id. */
  replace?: boolean;
}

export interface ToastData extends Required<Pick<ToastOptions, 'duration' | 'variant'>> {
  id: string | number;
  message: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  onDismiss?: (id: string | number) => void;
  createdAt: number;
}

export type ToastListener = (toasts: ToastData[]) => void;
