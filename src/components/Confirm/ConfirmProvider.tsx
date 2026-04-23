'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import ConfirmDialog from './ConfirmDialog';
import ConfirmWithNoteDialog from './ConfirmWithNoteDialog';
import type {
  ConfirmFn,
  ConfirmOptions,
  ConfirmWithNoteFn,
  ConfirmWithNoteOptions,
  ConfirmWithNoteResult,
} from './types';

interface ConfirmContextValue {
  confirm: ConfirmFn;
  confirmWithNote: ConfirmWithNoteFn;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface BasicQueueEntry {
  kind: 'basic';
  options: ConfirmOptions;
  resolve: (accepted: boolean) => void;
}

interface NoteQueueEntry {
  kind: 'note';
  options: ConfirmWithNoteOptions;
  resolve: (result: ConfirmWithNoteResult) => void;
}

type QueueEntry = BasicQueueEntry | NoteQueueEntry;

export interface ConfirmProviderProps {
  children: ReactNode;
}

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [current, setCurrent] = useState<QueueEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const queueRef = useRef<QueueEntry[]>([]);

  const advance = useCallback(() => {
    const next = queueRef.current.shift() ?? null;
    setCurrent(next);
    setLoading(false);
  }, []);

  const enqueue = useCallback((entry: QueueEntry) => {
    setCurrent((prev) => {
      if (prev) {
        queueRef.current.push(entry);
        return prev;
      }
      return entry;
    });
  }, []);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        enqueue({ kind: 'basic', options, resolve });
      }),
    [enqueue],
  );

  const confirmWithNote = useCallback<ConfirmWithNoteFn>(
    (options) =>
      new Promise<ConfirmWithNoteResult>((resolve) => {
        enqueue({ kind: 'note', options, resolve });
      }),
    [enqueue],
  );

  const handleBasicCancel = useCallback(() => {
    if (!current || current.kind !== 'basic' || loading) return;
    current.options.onCancel?.();
    current.resolve(false);
    advance();
  }, [current, loading, advance]);

  const handleBasicConfirm = useCallback(async () => {
    if (!current || current.kind !== 'basic') return;
    const { onConfirm } = current.options;
    if (!onConfirm) {
      current.resolve(true);
      advance();
      return;
    }
    try {
      const result = onConfirm();
      if (result && typeof (result as Promise<void>).then === 'function') {
        setLoading(true);
        await result;
      }
      current.resolve(true);
      advance();
    } catch {
      setLoading(false);
    }
  }, [current, advance]);

  const handleNoteCancel = useCallback(() => {
    if (!current || current.kind !== 'note' || loading) return;
    current.options.onCancel?.();
    current.resolve({ confirmed: false, note: '' });
    advance();
  }, [current, loading, advance]);

  const handleNoteConfirm = useCallback(
    async (note: string) => {
      if (!current || current.kind !== 'note') return;
      const { onConfirm } = current.options;
      if (!onConfirm) {
        current.resolve({ confirmed: true, note });
        advance();
        return;
      }
      try {
        const result = onConfirm();
        if (result && typeof (result as Promise<void>).then === 'function') {
          setLoading(true);
          await result;
        }
        current.resolve({ confirmed: true, note });
        advance();
      } catch {
        setLoading(false);
      }
    },
    [current, advance],
  );

  const value = useMemo<ConfirmContextValue>(
    () => ({ confirm, confirmWithNote }),
    [confirm, confirmWithNote],
  );

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {current && current.kind === 'basic' && (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            if (!open) handleBasicCancel();
          }}
          title={current.options.title}
          description={current.options.description}
          confirmText={current.options.confirmText}
          cancelText={current.options.cancelText}
          variant={current.options.variant}
          icon={current.options.icon}
          loading={loading}
          onConfirm={handleBasicConfirm}
        />
      )}
      {current && current.kind === 'note' && (
        <ConfirmWithNoteDialog
          open
          onCancel={handleNoteCancel}
          onConfirm={handleNoteConfirm}
          title={current.options.title}
          description={current.options.description}
          confirmText={current.options.confirmText}
          cancelText={current.options.cancelText}
          variant={current.options.variant}
          noteLabel={current.options.noteLabel}
          notePlaceholder={current.options.notePlaceholder}
          noteRequired={current.options.noteRequired}
          noteMinLength={current.options.noteMinLength}
          loading={loading}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error(
      'useConfirm() must be used inside <ConfirmProvider>. Wrap your app root (or the relevant subtree) to enable imperative confirm dialogs.',
    );
  }
  return ctx.confirm;
}

export function useConfirmWithNote(): ConfirmWithNoteFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error(
      'useConfirmWithNote() must be used inside <ConfirmProvider>.',
    );
  }
  return ctx.confirmWithNote;
}

export { ConfirmContext };
