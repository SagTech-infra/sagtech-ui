import type React from 'react';
import type { ReactNode } from 'react';

export type ConfirmVariant = 'default' | 'danger';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: ReactNode;
  loading?: boolean;
  /**
   * When true, the primary confirm button is disabled (e.g. while a parent
   * form is invalid). The cancel/close path remains active. Default: false.
   */
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  /**
   * Controls which element receives focus when the dialog opens.
   * - `string` — CSS selector queried within the dialog root.
   * - `HTMLElement` — focused directly.
   * - `React.RefObject<HTMLElement>` — focuses `ref.current` if non-null.
   * - `null` — suppresses auto-focus entirely.
   * - `undefined` (default) — focuses the primary confirm button via the
   *   `data-sagtech-confirm-primary="true"` attribute.
   */
  initialFocusTarget?:
    | string
    | HTMLElement
    | React.RefObject<HTMLElement>
    | null;
}

export interface ConfirmWithNoteDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (note: string) => void;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  noteLabel?: string;
  notePlaceholder?: string;
  noteRequired?: boolean;
  noteMinLength?: number;
  /** Optional max-length on the note; renders an inline counter when set. */
  noteMaxLength?: number;
  /** Helper text shown below the textarea. */
  noteHelperText?: ReactNode;
  loading?: boolean;
}

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

export interface ConfirmWithNoteOptions extends ConfirmOptions {
  /** If true, the user cannot confirm with an empty note. Defaults to false. */
  noteRequired?: boolean;
  noteLabel?: string;
  notePlaceholder?: string;
  /** Minimum length of the note when `noteRequired`. Defaults to 1. */
  noteMinLength?: number;
}

export type ConfirmWithNoteResult = {
  confirmed: boolean;
  note: string;
};

export type ConfirmWithNoteFn = (
  options: ConfirmWithNoteOptions,
) => Promise<ConfirmWithNoteResult>;
