'use client';

import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableListRenderContext {
  isDragging: boolean;
  dragHandleProps: Record<string, unknown>;
}

export interface SortableListProps<T> {
  items: T[];
  getItemId: (item: T) => string | number;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, ctx: SortableListRenderContext) => React.ReactNode;
  direction?: 'vertical' | 'horizontal' | 'grid';
  disabled?: boolean;
  className?: string;
}

function SortableItem<T>({
  item,
  id,
  renderItem,
  disabled,
}: {
  item: T;
  id: string | number;
  renderItem: (item: T, ctx: SortableListRenderContext) => React.ReactNode;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    touchAction: 'none',
  };

  const dragHandleProps = {
    ...attributes,
    ...listeners,
    ref: setActivatorNodeRef,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, { isDragging, dragHandleProps })}
    </div>
  );
}

export default function SortableList<T>({
  items,
  getItemId,
  onReorder,
  renderItem,
  direction = 'vertical',
  disabled,
  className,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = useMemo(() => items.map((item) => getItemId(item)), [items, getItemId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id as string | number);
    const newIndex = ids.indexOf(over.id as string | number);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  const strategy =
    direction === 'horizontal'
      ? horizontalListSortingStrategy
      : direction === 'grid'
        ? rectSortingStrategy
        : verticalListSortingStrategy;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={strategy}>
        <div
          className={className}
          style={{
            display: direction === 'horizontal' ? 'flex' : direction === 'grid' ? 'grid' : 'block',
            gap: direction === 'horizontal' ? 8 : undefined,
          }}
        >
          {items.map((item) => {
            const id = getItemId(item);
            return (
              <SortableItem
                key={id}
                item={item}
                id={id}
                renderItem={renderItem}
                disabled={disabled}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
