'use client';

import { useState, useMemo } from 'react';
import classNames from 'classnames';

export interface Column<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  emptyText?: string;
  className?: string;
}

interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

function SortIcon({ active, direction }: { active: boolean; direction?: 'asc' | 'desc' }) {
  return (
    <span className="inline-flex flex-col ml-6px gap-[1px]">
      <svg
        width={8}
        height={5}
        viewBox="0 0 8 5"
        fill="none"
        className={classNames('transition-colors', {
          'text-pr_purple': active && direction === 'asc',
          'text-grey_1': !active || direction !== 'asc',
        })}
      >
        <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
      </svg>
      <svg
        width={8}
        height={5}
        viewBox="0 0 8 5"
        fill="none"
        className={classNames('transition-colors', {
          'text-pr_purple': active && direction === 'desc',
          'text-grey_1': !active || direction !== 'desc',
        })}
      >
        <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  striped = false,
  hoverable = true,
  compact = false,
  emptyText = 'No data',
  className,
}: TableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };

  const sortedData = useMemo(() => {
    if (!sort) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison: number;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort]);

  return (
    <div
      className={classNames(
        'border_gradient_24_stroke_2 rounded-16px sm:rounded-24px overflow-hidden',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={classNames(
                    'py-16px px-24px font-manrope font-semibold text-12 uppercase tracking-[0.06em] border-b border-shape_stroke_2_part_two',
                    alignClasses[col.align ?? 'left'],
                    {
                      'text-pr_purple': sort?.key === col.key,
                      'text-fg-muted': sort?.key !== col.key,
                      'cursor-pointer select-none hover:text-fg-primary transition-colors': col.sortable,
                    },
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        active={sort?.key === col.key}
                        direction={sort?.key === col.key ? sort.direction : undefined}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-fg-muted font-manrope text-14 py-48px"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={classNames('transition-colors duration-150', {
                    'bg-backdrop_2': striped && rowIndex % 2 === 1,
                    'hover:bg-backdrop_2 cursor-pointer': hoverable && onRowClick,
                    'hover:bg-backdrop_2': hoverable && !onRowClick,
                  })}
                  style={
                    rowIndex < sortedData.length - 1
                      ? { borderBottom: '1px solid rgba(47,30,94,0.4)' }
                      : undefined
                  }
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col, ci) => (
                    <td
                      key={col.key}
                      className={classNames(
                        'font-manrope text-14 overflow-visible',
                        alignClasses[col.align ?? 'left'],
                        {
                          'py-12px px-20px': compact,
                          'py-20px px-24px': !compact,
                          'text-fg-primary font-medium': ci === 0,
                          'text-fg-muted': ci !== 0,
                        },
                      )}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
