'use client';

import { useCallback, useMemo, type ReactNode } from 'react';
import classNames from 'classnames';
import type { DataTableColumn, DataTableProps, SortDirection, SortState } from './types';

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <span className="inline-flex flex-col ml-4px items-center justify-center w-[10px] h-[14px] text-[10px]">
      <span
        aria-hidden="true"
        className={classNames('leading-none', {
          'text-pr_purple': direction === 'asc',
          'text-fg-muted': direction !== 'asc',
        })}
      >
        ▲
      </span>
      <span
        aria-hidden="true"
        className={classNames('leading-none', {
          'text-pr_purple': direction === 'desc',
          'text-fg-muted': direction !== 'desc',
        })}
      >
        ▼
      </span>
    </span>
  );
}

function HeaderCell<T, K extends string>({
  column,
  currentSort,
  onSort,
  compact,
}: {
  column: DataTableColumn<T, K>;
  currentSort: SortState<K> | null | undefined;
  onSort?: (key: string) => void;
  compact: boolean;
}) {
  const sortable = Boolean(column.sortable && onSort);
  const active = currentSort?.key === column.key;
  const direction = active ? currentSort!.direction : null;

  const content = (
    <span className={classNames('inline-flex items-center', alignClasses[column.align ?? 'left'])}>
      {column.header}
      {sortable && <SortIcon direction={direction} />}
    </span>
  );

  return (
    <th
      scope="col"
      aria-sort={
        active ? (direction === 'asc' ? 'ascending' : 'descending') : sortable ? 'none' : undefined
      }
      style={column.width ? { width: column.width } : undefined}
      className={classNames(
        'font-manrope text-12 uppercase tracking-wide text-fg-muted font-semibold',
        alignClasses[column.align ?? 'left'],
        {
          'py-8px px-16px': compact,
          'py-12px px-20px': !compact,
          'cursor-pointer select-none hover:text-fg-primary': sortable,
        },
      )}
    >
      {sortable ? (
        <button
          type="button"
          onClick={() => onSort?.(column.key)}
          className="bg-transparent border-0 p-0 m-0 text-inherit font-inherit uppercase tracking-wide cursor-pointer inline-flex items-center"
        >
          {content}
        </button>
      ) : (
        content
      )}
    </th>
  );
}

export default function DataTable<T, K extends string = string>({
  columns,
  data,
  getRowId,
  sort,
  onSortChange,
  selection,
  onSelectionChange,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  emptyText = 'No data',
  loading = false,
  compact = false,
  className,
  caption,
}: DataTableProps<T, K>) {
  const hasSelection = Boolean(onSelectionChange);
  const selectionSet = useMemo(() => new Set(selection ?? []), [selection]);

  const rowId = useCallback(
    (row: T, index: number): string | number => (getRowId ? getRowId(row, index) : index),
    [getRowId],
  );

  const allVisibleIds = useMemo(() => data.map((r, i) => rowId(r, i)), [data, rowId]);
  const allSelected =
    hasSelection && allVisibleIds.length > 0 && allVisibleIds.every((id) => selectionSet.has(id));
  const someSelected =
    hasSelection && !allSelected && allVisibleIds.some((id) => selectionSet.has(id));

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([...(selection ?? [])].filter((id) => !allVisibleIds.includes(id)));
    } else {
      const next = new Set<string | number>(selection ?? []);
      allVisibleIds.forEach((id) => next.add(id));
      onSelectionChange([...next]);
    }
  };

  const handleToggleRow = (id: string | number) => {
    if (!onSelectionChange) return;
    const next = new Set<string | number>(selection ?? []);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange([...next]);
  };

  const handleSortClick = (key: string) => {
    if (!onSortChange) return;
    const typedKey = key as K;
    if (sort?.key === typedKey) {
      if (sort.direction === 'asc') onSortChange({ key: typedKey, direction: 'desc' });
      else onSortChange(null);
    } else {
      onSortChange({ key: typedKey, direction: 'asc' });
    }
  };

  const totalColumns = columns.length + (hasSelection ? 1 : 0);

  const tableEl = (
    <table className="w-full border-collapse font-manrope">
      {caption && <caption className="text-left text-14 text-fg-muted pb-12px">{caption}</caption>}
      <thead
        className={classNames('bg-bg-secondary', {
          'sticky top-0 z-10': stickyHeader,
        })}
      >
        <tr className="border-b border-solid border-border-default">
          {hasSelection && (
            <th
              scope="col"
              className={classNames('w-[40px]', {
                'py-8px px-12px': compact,
                'py-12px px-16px': !compact,
              })}
            >
              <input
                type="checkbox"
                aria-label={allSelected ? 'Deselect all rows' : 'Select all rows'}
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={handleToggleAll}
                className="cursor-pointer"
              />
            </th>
          )}
          {columns.map((col) => (
            <HeaderCell
              key={col.key}
              column={col}
              currentSort={sort as SortState<K> | null | undefined}
              onSort={onSortChange ? handleSortClick : undefined}
              compact={compact}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <tr
              key={`skeleton-${i}`}
              className="border-b border-border-default animate-pulse"
              aria-hidden="true"
            >
              {hasSelection && <td className="py-12px px-16px" />}
              {columns.map((c) => (
                <td key={c.key} className="py-12px px-20px">
                  <div className="h-[14px] w-full bg-bg-tertiary rounded-8px" />
                </td>
              ))}
            </tr>
          ))}
        {!loading && data.length === 0 && (
          <tr>
            <td
              colSpan={totalColumns}
              className="py-24px text-center text-fg-muted text-14"
            >
              {emptyText}
            </td>
          </tr>
        )}
        {!loading &&
          data.map((row, index) => {
            const id = rowId(row, index);
            const selected = selectionSet.has(id);
            return (
              <tr
                key={id}
                className={classNames('border-b border-solid border-border-default transition-colors', {
                  'bg-pr_purple/10': selected,
                  'hover:bg-bg-secondary': !selected,
                  'cursor-pointer': onRowClick,
                })}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                data-selected={selected || undefined}
              >
                {hasSelection && (
                  <td
                    className={classNames({
                      'py-8px px-12px': compact,
                      'py-12px px-16px': !compact,
                    })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      aria-label={selected ? 'Deselect row' : 'Select row'}
                      checked={selected}
                      onChange={() => handleToggleRow(id)}
                      className="cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col, ci) => (
                  <td
                    key={col.key}
                    className={classNames(
                      'text-14',
                      alignClasses[col.align ?? 'left'],
                      {
                        'py-8px px-16px': compact,
                        'py-12px px-20px': !compact,
                        'text-fg-primary': ci === 0,
                        'text-fg-muted': ci !== 0,
                      },
                    )}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.render
                      ? col.render(row, col.key)
                      : renderPrimitive(row, col.key)}
                  </td>
                ))}
              </tr>
            );
          })}
      </tbody>
    </table>
  );

  return (
    <div
      className={classNames(
        'w-full rounded-16px border border-solid border-border-default bg-bg-primary overflow-hidden',
        className,
      )}
    >
      <div
        className={classNames({
          'overflow-auto': Boolean(maxHeight) || stickyHeader,
        })}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {tableEl}
      </div>
    </div>
  );
}

function renderPrimitive<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return null;
}
