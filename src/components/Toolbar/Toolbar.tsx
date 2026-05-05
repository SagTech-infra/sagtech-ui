'use client';

import classNames from 'classnames';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

export type ToolbarOrientation = 'horizontal' | 'vertical';
export type ToolbarSize = 'sm' | 'md';

export interface ToolbarProps {
  children: ReactNode;
  orientation?: ToolbarOrientation;
  /** Required for accessibility; describes what the toolbar controls. */
  ariaLabel?: string;
  size?: ToolbarSize;
  className?: string;
}

export interface ToolbarSeparatorProps {
  orientation?: ToolbarOrientation;
  className?: string;
}

const sizeClasses: Record<ToolbarSize, string> = {
  sm: 'p-2px gap-2px',
  md: 'p-4px gap-4px',
};

function ToolbarSeparator({ orientation = 'horizontal', className }: ToolbarSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      className={classNames(
        'bg-black_3 flex-shrink-0',
        orientation === 'horizontal' ? 'w-[1px] h-full self-stretch mx-2px' : 'h-[1px] w-full my-2px',
        className,
      )}
    />
  );
}

interface ToolbarComponent
  extends React.ForwardRefExoticComponent<ToolbarProps & React.RefAttributes<HTMLDivElement>> {
  Separator: typeof ToolbarSeparator;
}

const ToolbarBase = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  {
    children,
    orientation = 'horizontal',
    ariaLabel,
    size = 'md',
    className,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  const focusables = useCallback(() => {
    const container = containerRef.current;
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [role="button"]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = focusables();
    if (items.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? items.indexOf(active) : -1;
    const isHorizontal = orientation === 'horizontal';

    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    if (event.key === nextKey) {
      event.preventDefault();
      const next = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      items[next]?.focus();
    } else if (event.key === prevKey) {
      event.preventDefault();
      const prev = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      items[prev]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  // Patch Separator children with the orientation if not explicitly set.
  const decoratedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === ToolbarSeparator) {
      const childProps = child.props as ToolbarSeparatorProps;
      if (!childProps.orientation) {
        return cloneElement(child as ReactElement<ToolbarSeparatorProps>, { orientation });
      }
    }
    return child;
  });

  return (
    <div
      ref={setRefs}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={classNames(
        'inline-flex items-center rounded-8px bg-black_2 border border-black_3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        sizeClasses[size],
        className,
      )}
    >
      {decoratedChildren}
    </div>
  );
}) as ToolbarComponent;

ToolbarBase.Separator = ToolbarSeparator;

export const Toolbar = ToolbarBase;
export { ToolbarSeparator };

export default Toolbar;
