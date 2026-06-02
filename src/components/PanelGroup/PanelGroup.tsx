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

interface InnerGroupProps {
  direction: 'horizontal' | 'vertical';
  className?: string;
  children?: ReactNode;
  groupRef?: Ref<GroupImperativeHandle | null>;
}

/**
 * Renders the lib `Group` with persistence wired in. `useDefaultLayout` runs
 * here — and only here — so non-persisted groups never invoke it (avoids the
 * shared-key collision when many PanelGroups mount without an `autoSaveId`).
 */
function PersistedGroup({
  autoSaveId,
  direction,
  className,
  children,
  groupRef,
}: InnerGroupProps & { autoSaveId: string }) {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: autoSaveId });

  return (
    <RRGroup
      groupRef={groupRef}
      id={autoSaveId}
      orientation={direction}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      className={classNames('flex', className)}
    >
      {children}
    </RRGroup>
  );
}

/** Renders the lib `Group` with no persistence (no `useDefaultLayout`). */
function PlainGroup({ direction, className, children, groupRef }: InnerGroupProps) {
  return (
    <RRGroup
      groupRef={groupRef}
      orientation={direction}
      className={classNames('flex', className)}
    >
      {children}
    </RRGroup>
  );
}

export function PanelGroup({
  direction,
  autoSaveId,
  className,
  children,
  ref,
}: PanelGroupProps) {
  // Branch at the component boundary so the persistence hook is only invoked
  // when an `autoSaveId` is provided (keeps hooks-rules valid per render).
  if (autoSaveId) {
    return (
      <PersistedGroup
        autoSaveId={autoSaveId}
        direction={direction}
        className={className}
        groupRef={ref}
      >
        {children}
      </PersistedGroup>
    );
  }

  return (
    <PlainGroup direction={direction} className={className} groupRef={ref}>
      {children}
    </PlainGroup>
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
        // react-resizable-panels@4 emits a single `data-separator` whose VALUE
        // changes ("active" while dragging, "focus" on keyboard focus). Match the
        // value rather than a never-present `data-separator-active` attribute.
        'hover:bg-border-strong data-[separator=active]:bg-border-strong data-[separator=focus]:bg-border-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple',
        direction === 'horizontal' ? 'w-[6px] cursor-col-resize' : 'h-[6px] cursor-row-resize',
        className,
      )}
    />
  );
}
