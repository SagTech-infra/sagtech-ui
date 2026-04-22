'use client';

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

export interface SlotProps {
  children?: ReactNode;
  [key: string]: unknown;
}

/**
 * Minimal Slot — forwards the container's props onto a single ReactElement
 * child. Used by Form components to inject id / aria-* attributes onto
 * whatever input element the consumer renders inside <FormControl>.
 *
 * A small dependency-free replacement for @radix-ui/react-slot for this
 * use case: it does not support asChild composition, ref merging through
 * React 18's forwardRef chains, or the slottable pattern. That is
 * intentional — the Form surface only needs prop injection.
 */
export function Slot({ children, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    return children as unknown as ReactElement;
  }

  const child = Children.only(children) as ReactElement<Record<string, unknown>>;
  const childProps = (child.props ?? {}) as Record<string, unknown>;

  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  // Merge className explicitly so slot-provided class doesn't replace child's.
  const slotClass = slotProps.className as string | undefined;
  const childClass = childProps.className as string | undefined;
  if (slotClass || childClass) {
    merged.className = [slotClass, childClass].filter(Boolean).join(' ');
  }

  return cloneElement(child, merged);
}

export default Slot;
