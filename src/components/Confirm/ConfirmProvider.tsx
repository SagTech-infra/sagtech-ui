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
import type { ConfirmFn, ConfirmOptions } from './types';

interface ConfirmContextValue {
  confirm: ConfirmFn;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface QueueEntry {
  options: ConfirmOptions;
  resolve: (accepted: boolean) => void;
}

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

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        const entry: QueueEntry = { options, resolve };
        setCurrent((prev) => {
          if (prev) {
            queueRef.current.push(entry);
            return prev;
          }
          return entry;
        });
      }),
    [],
  );

  const resolveAndClose = useCallback(
    (accepted: boolean) => {
      if (!current) return;
      current.resolve(accepted);
      advance();
    },
    [current, advance],
  );

  const handleCancel = useCallback(() => {
    if (!current || loading) return;
    current.options.onCancel?.();
    resolveAndClose(false);
  }, [current, loading, resolveAndClose]);

  const handleConfirm = useCallback(async () => {
    if (!current) return;
    const { onConfirm } = current.options;
    if (!onConfirm) {
      resolveAndClose(true);
      return;
    }
    try {
      const result = onConfirm();
      if (result && typeof (result as Promise<void>).then === 'function') {
        setLoading(true);
        await result;
      }
      resolveAndClose(true);
    } catch {
      setLoading(false);
    }
  }, [current, resolveAndClose]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) handleCancel();
    },
    [handleCancel],
  );

  const value = useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {current && (
        <ConfirmDialog
          open
          onOpenChange={handleOpenChange}
          title={current.options.title}
          description={current.options.description}
          confirmText={current.options.confirmText}
          cancelText={current.options.cancelText}
          variant={current.options.variant}
          icon={current.options.icon}
          loading={loading}
          onConfirm={handleConfirm}
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

export { ConfirmContext };
