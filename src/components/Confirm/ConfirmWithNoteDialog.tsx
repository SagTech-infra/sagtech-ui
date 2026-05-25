'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useOverlayTransition } from '@/hooks/useMotion';
import Typography from '@/components/Typography/Typography';
import Button from '@/components/Button/Button';
import { TextArea } from '@/components/TextArea/TextArea';
import type { ConfirmVariant } from './types';

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
  loading?: boolean;
}

export default function ConfirmWithNoteDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  noteLabel = 'Reason',
  notePlaceholder = 'Add a note…',
  noteRequired = false,
  noteMinLength = 1,
  loading = false,
}: ConfirmWithNoteDialogProps) {
  const t = useOverlayTransition('fast');
  const dialogRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!open) {
      setNote('');
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onCancel]);

  const handleBackdropClick = useCallback(() => {
    if (!loading) onCancel();
  }, [loading, onCancel]);

  if (typeof document === 'undefined') return null;

  const canConfirm = !noteRequired || note.trim().length >= noteMinLength;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sagtech-confirm-note-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-16px"
        >
          <motion.div
            className="absolute inset-0 bg-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t}
            onClick={handleBackdropClick}
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={t}
            className="relative w-full max-w-[440px] rounded-24px border border-solid border-black_3 bg-black_1 p-24px shadow-4xl"
          >
            <div className="flex flex-col gap-16px">
              <Typography tag="h3" color="text-white_4" id="sagtech-confirm-note-title">
                {title}
              </Typography>
              {description && (
                <Typography tag="p" type="BodyM" color="text-grey_4">
                  {description}
                </Typography>
              )}
              <div className="flex flex-col gap-6px">
                <Typography tag="label" type="LabelsS" color="text-white_1" htmlFor="sagtech-confirm-note">
                  {noteLabel}
                  {noteRequired && <span className="text-error"> *</span>}
                </Typography>
                <TextArea
                  id="sagtech-confirm-note"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.currentTarget.value)}
                  placeholder={notePlaceholder}
                />
              </div>
              <div className="flex justify-end gap-12px pt-8px">
                <Button
                  text={cancelText}
                  buttonSize="small"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={loading}
                />
                <Button
                  text={confirmText}
                  buttonSize="small"
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  onClick={() => onConfirm(note.trim())}
                  loadingType={loading}
                  disabled={loading || !canConfirm}
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
