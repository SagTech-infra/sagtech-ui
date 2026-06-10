"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { TextArea } from "@/components/TextArea/TextArea";
import type { ConfirmWithNoteDialogProps } from "./types";

export default function ConfirmWithNoteDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  noteLabel = "Reason",
  notePlaceholder = "Add a note…",
  noteRequired = false,
  noteMinLength = 1,
  noteMaxLength,
  noteHelperText,
  loading = false,
}: ConfirmWithNoteDialogProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) {
      setNote("");
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onCancel]);

  const handleBackdropClick = useCallback(() => {
    if (!loading) onCancel();
  }, [loading, onCancel]);

  if (typeof document === "undefined") return null;

  const trimmedLength = note.trim().length;
  const exceedsMax = noteMaxLength !== undefined && note.length > noteMaxLength;
  const canConfirm =
    (!noteRequired || trimmedLength >= noteMinLength) && !exceedsMax;

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
            transition={
              reduceMotion ? { duration: 0 } : tokenTransition("fast")
            }
            onClick={handleBackdropClick}
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={
              reduceMotion ? { duration: 0 } : tokenTransition("fast")
            }
            className="relative w-full max-w-[440px] rounded-24px border border-solid border-black_3 bg-black_1 p-24px shadow-4xl"
          >
            <div className="flex flex-col gap-16px">
              <Typography
                tag="h3"
                color="text-current"
                id="sagtech-confirm-note-title"
              >
                {title}
              </Typography>
              {description && (
                <Typography tag="p" type="BodyM" color="text-current">
                  {description}
                </Typography>
              )}
              <div className="flex flex-col gap-6px">
                <Typography
                  tag="label"
                  type="LabelsS"
                  color="text-current"
                  htmlFor="sagtech-confirm-note"
                >
                  {noteLabel}
                  {noteRequired && <span className="text-error"> *</span>}
                </Typography>
                <TextArea
                  id="sagtech-confirm-note"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.currentTarget.value)}
                  placeholder={notePlaceholder}
                  maxLength={noteMaxLength}
                />
                {(noteHelperText || noteMaxLength !== undefined) && (
                  <div className="flex items-center justify-between gap-12px">
                    {noteHelperText ? (
                      <Typography
                        tag="span"
                        type="LabelsS"
                        color={exceedsMax ? "text-error" : "text-current"}
                      >
                        {noteHelperText}
                      </Typography>
                    ) : (
                      <span />
                    )}
                    {noteMaxLength !== undefined && (
                      <Typography
                        tag="span"
                        type="LabelsS"
                        color={exceedsMax ? "text-error" : "text-current"}
                      >
                        {note.length} / {noteMaxLength}
                      </Typography>
                    )}
                  </div>
                )}
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
                  variant={variant === "danger" ? "danger" : "primary"}
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
