type StackEntry = {
  id: number;
  onEscape?: () => void;
};

let nextId = 0;
let stack: StackEntry[] = [];
const listeners = new Set<() => void>();
let globalEscapeAttached = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function ensureGlobalEscape() {
  if (globalEscapeAttached || typeof document === 'undefined') return;
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const top = stack[stack.length - 1];
    if (top?.onEscape) {
      event.stopPropagation();
      top.onEscape();
    }
  });
  globalEscapeAttached = true;
}

export function registerOverlay(onEscape?: () => void): number {
  ensureGlobalEscape();
  const id = ++nextId;
  const wasEmpty = stack.length === 0;
  stack = [...stack, { id, onEscape }];
  if (wasEmpty && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
  notify();
  return id;
}

export function unregisterOverlay(id: number): void {
  stack = stack.filter((entry) => entry.id !== id);
  if (stack.length === 0 && typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  notify();
}

export function getOverlayDepth(id: number): number {
  const index = stack.findIndex((entry) => entry.id === id);
  return index === -1 ? 0 : index;
}

export function subscribeOverlayStack(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
