'use client';

import { type ReactNode, type Ref } from 'react';
import classNames from 'classnames';
import {
  Group as RRGroup,
  Panel as RRPanel,
  Separator as RRSeparator,
  useDefaultLayout,
  type GroupImperativeHandle,
} from 'react-resizable-panels';

/**
 * react-resizable-panels@4 renames the classic v0–v2 API:
 *   PanelGroup -> Group   (direction -> orientation)
 *   PanelResizeHandle -> Separator (role="separator")
 *
 * These wrappers preserve the familiar `PanelGroup` / `Panel` /
 * `PanelResizeHandle` surface while delegating to the installed v4 library
 * and applying the design-token styling.
 */

export interface PanelGroupProps {
  /** Resizable axis. Maps to the library's `orientation`. */
  direction: 'horizontal' | 'vertical';
  /**
   * Persist the group layout across reloads (keyed by this id).
   * Maps to the library's `useDefaultLayout` + `id`.
   */
  autoSaveId?: string;
  className?: string;
  children?: ReactNode;
  /** Imperative handle for `getLayout` / `setLayout`. */
  ref?: Ref<GroupImperativeHandle | null>;
}

export function PanelGroup({
  direction,
  autoSaveId,
  className,
  children,
  ref,
}: PanelGroupProps) {
  // Hooks must run unconditionally; only wire the result when persisting.
  const persistence = useDefaultLayout({ id: autoSaveId ?? '__panel-group__' });
  const persistenceProps = autoSaveId
    ? {
        id: autoSaveId,
        defaultLayout: persistence.defaultLayout,
        onLayoutChanged: persistence.onLayoutChanged,
      }
    : {};

  return (
    <RRGroup
      groupRef={ref}
      orientation={direction}
      className={classNames('flex', className)}
      {...persistenceProps}
    >
      {children}
    </RRGroup>
  );
}

export interface PanelProps {
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsible?: boolean;
  className?: string;
  children?: ReactNode;
  id?: string;
  /** Render order within the group (lib uses DOM order; reserved for parity). */
  order?: number;
}

export function Panel({
  defaultSize,
  minSize,
  maxSize,
  collapsible,
  className,
  children,
  id,
}: PanelProps) {
  return (
    <RRPanel
      id={id}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      className={className}
    >
      {children}
    </RRPanel>
  );
}

export interface PanelResizeHandleProps {
  /** Axis of the parent group; controls the handle's thin dimension. */
  direction?: 'horizontal' | 'vertical';
  className?: string;
  id?: string;
}

export function PanelResizeHandle({
  direction = 'horizontal',
  className,
  id,
}: PanelResizeHandleProps) {
  return (
    <RRSeparator
      id={id}
      className={classNames(
        'group relative flex shrink-0 items-center justify-center',
        'bg-border-default transition-colors duration-150',
        'hover:bg-border-strong data-[separator-active]:bg-border-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple',
        direction === 'horizontal' ? 'w-[6px] cursor-col-resize' : 'h-[6px] cursor-row-resize',
        className,
      )}
    />
  );
}
