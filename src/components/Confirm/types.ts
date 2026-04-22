import type { ReactNode } from 'react';

export type ConfirmVariant = 'default' | 'danger';

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: ReactNode;
  /**
   * Hook called when the user accepts. If it returns a promise the dialog
   * stays open in loading state until it resolves; a rejection re-enables
   * the dialog. If it completes successfully, the `confirm()` promise
   * resolves with `true` and the dialog closes.
   */
  onConfirm?: () => void | Promise<void>;
  /**
   * Hook called when the user rejects (cancel button, backdrop click, Esc).
   * Runs right before the `confirm()` promise resolves with `false`.
   */
  onCancel?: () => void;
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
