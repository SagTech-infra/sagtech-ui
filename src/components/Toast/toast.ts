import type { ReactNode } from 'react';
import { toastStore } from './ToastStore';
import type { ToastOptions, ToastVariant } from './types';

type ToastFn = (message: ReactNode, options?: ToastOptions) => string | number;

interface ToastPromiseMessages<T> {
  loading: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error: ReactNode | ((reason: unknown) => ReactNode);
}

export interface ToastApi extends ToastFn {
  success: ToastFn;
  error: ToastFn;
  warning: ToastFn;
  info: ToastFn;
  loading: ToastFn;
  dismiss: (id?: string | number) => void;
  update: (id: string | number, options: Partial<ToastOptions> & { message?: ReactNode }) => void;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: ToastPromiseMessages<T>,
    options?: Omit<ToastOptions, 'variant' | 'id'>,
  ) => Promise<T>;
}

function withVariant(variant: ToastVariant): ToastFn {
  return (message, options) => toastStore.push(message, { ...options, variant });
}

const baseToast: ToastFn = (message, options) => toastStore.push(message, options);

const api = baseToast as ToastApi;
api.success = withVariant('success');
api.error = withVariant('error');
api.warning = withVariant('warning');
api.info = withVariant('info');
api.loading = withVariant('loading');

api.dismiss = (id) => toastStore.dismiss(id);

api.update = (id, { message, ...options }) => {
  const patch: Record<string, unknown> = { ...options };
  if (message !== undefined) patch.message = message;
  toastStore.update(id, patch as never);
};

api.promise = function promiseToast(input, messages, options = {}) {
  const promise = typeof input === 'function' ? input() : input;
  const id = toastStore.push(messages.loading, {
    ...options,
    variant: 'loading',
  });

  promise.then(
    (value) => {
      const msg =
        typeof messages.success === 'function'
          ? (messages.success as (v: unknown) => ReactNode)(value)
          : messages.success;
      toastStore.push(msg, { ...options, id, variant: 'success', replace: true });
    },
    (reason) => {
      const msg =
        typeof messages.error === 'function'
          ? (messages.error as (r: unknown) => ReactNode)(reason)
          : messages.error;
      toastStore.push(msg, { ...options, id, variant: 'error', replace: true });
    },
  );

  return promise;
};

export const toast = api;
