import type { ReactNode } from 'react';
import type { ToastData, ToastListener, ToastOptions, ToastVariant } from './types';

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  default: 4000,
  info: 4000,
  success: 4000,
  warning: 6000,
  error: 6000,
  loading: Number.POSITIVE_INFINITY,
};

let idCounter = 0;
function makeId(): number {
  idCounter += 1;
  return idCounter;
}

class ToastStore {
  private toasts: ToastData[] = [];
  private listeners = new Set<ToastListener>();

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): ToastData[] {
    return this.toasts;
  }

  private emit() {
    for (const l of this.listeners) l(this.toasts);
  }

  push(message: ReactNode, options: ToastOptions = {}): string | number {
    const variant: ToastVariant = options.variant ?? 'default';
    const id = options.id ?? makeId();
    const duration = options.duration ?? DEFAULT_DURATION[variant];
    const entry: ToastData = {
      id,
      message,
      description: options.description,
      action: options.action,
      onDismiss: options.onDismiss,
      variant,
      duration,
      createdAt: Date.now(),
    };

    const existingIdx = this.toasts.findIndex((t) => t.id === id);
    if (existingIdx !== -1) {
      if (options.replace) {
        this.toasts = this.toasts.map((t, i) => (i === existingIdx ? entry : t));
      } else {
        this.toasts = [...this.toasts.slice(0, existingIdx), entry, ...this.toasts.slice(existingIdx + 1)];
      }
    } else {
      this.toasts = [...this.toasts, entry];
    }
    this.emit();
    return id;
  }

  dismiss(id?: string | number) {
    if (id === undefined) {
      const removed = this.toasts;
      this.toasts = [];
      removed.forEach((t) => t.onDismiss?.(t.id));
      this.emit();
      return;
    }
    const target = this.toasts.find((t) => t.id === id);
    if (!target) return;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    target.onDismiss?.(id);
    this.emit();
  }

  update(id: string | number, patch: Partial<ToastData>) {
    const idx = this.toasts.findIndex((t) => t.id === id);
    if (idx === -1) return;
    this.toasts = this.toasts.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    this.emit();
  }

  clear() {
    this.toasts = [];
    this.emit();
  }
}

export const toastStore = new ToastStore();
