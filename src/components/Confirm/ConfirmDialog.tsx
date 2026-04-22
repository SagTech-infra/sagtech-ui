'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import Typography from '@/components/Typography/Typography';
import Button from '@/components/Button/Button';
import type { ConfirmVariant } from './types';

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
  onConfirm?: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onOpenChange(false);
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => {
      const primary = dialogRef.current?.querySelector<HTMLButtonElement>(
        'button[data-sagtech-confirm-primary="true"]',
      );
      primary?.focus();
    }, 0);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, loading, onOpenChange]);

  const handleBackdropClick = useCallback(() => {
    if (!loading) onOpenChange(false);
  }, [loading, onOpenChange]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sagtech-confirm-title"
          aria-describedby={description ? 'sagtech-confirm-desc' : undefined}
          className="fixed inset-0 z-50 flex items-center justify-center p-16px"
        >
          <motion.div
            className="absolute inset-0 bg-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleBackdropClick}
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-[420px] rounded-24px border border-black_3 bg-black_1 p-24px shadow-4xl"
          >
            <div className="flex flex-col gap-16px">
              {icon && <div className="flex items-center justify-center">{icon}</div>}
              <Typography tag="h3" color="text-white_4" id="sagtech-confirm-title">
                {title}
              </Typography>
              {description && (
                <Typography
                  tag="p"
                  type="BodyM"
                  color="text-grey_4"
                  id="sagtech-confirm-desc"
                >
                  {description}
                </Typography>
              )}
              <div className="flex justify-end gap-12px pt-8px">
                <Button
                  text={cancelText}
                  buttonSize="small"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                />
                <Button
                  data-sagtech-confirm-primary="true"
                  text={confirmText}
                  buttonSize="small"
                  variant="primary"
                  onClick={onConfirm}
                  loadingType={loading}
                  disabled={loading}
                  classes={classNames({
                    '!bg-error hover:!bg-error/80 !border-error': variant === 'danger',
                  })}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
