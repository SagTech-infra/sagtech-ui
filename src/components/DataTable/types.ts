import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

export interface DataTableColumn<T, K extends string = Extract<keyof T, string>> {
  key: K | string;
  header: ReactNode;
  /** Cell renderer. Receives the row and the column key. */
  render?: (row: T, key: string) => ReactNode;
  /** Align cell content. Default 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Column width — any valid CSS value. */
  width?: string | number;
  /** Mark the column sortable; renders a clickable header. */
  sortable?: boolean;
}

export interface DataTableProps<T, K extends string = string> {
  columns: Array<DataTableColumn<T, K>>;
  data: ReadonlyArray<T>;
  /** Extracts a stable id from each row. Required when using row selection. */
  getRowId?: (row: T, index: number) => string | number;
  /** Controlled sort state. */
  sort?: SortState<K> | null;
  /** Called when the user toggles sorting on a sortable column. */
  onSortChange?: (next: SortState<K> | null) => void;
  /** Controlled selection (row ids). */
  selection?: ReadonlyArray<string | number>;
  /** Called when the selection changes. */
  onSelectionChange?: (next: Array<string | number>) => void;
  /** Show a sticky header while the table scrolls. */
  stickyHeader?: boolean;
  /** Max height for a scroll container. Accepts any CSS value. */
  maxHeight?: string | number;
  /** Row click handler. */
  onRowClick?: (row: T, index: number) => void;
  /** Text shown when data is empty and not loading. */
  emptyText?: ReactNode;
  /** Loading flag — shows a skeleton / shimmer row. */
  loading?: boolean;
  /** Density. */
  compact?: boolean;
  /** Extra className on the outer wrapper. */
  className?: string;
  /** Render a custom caption element above the table. */
  caption?: ReactNode;
}
