import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import DataTable from '../DataTable';
import type { DataTableColumn, SortState } from '../types';

interface Row {
  id: number;
  name: string;
  role: string;
}

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
];

const data: Row[] = [
  { id: 1, name: 'Ada', role: 'eng' },
  { id: 2, name: 'Alan', role: 'res' },
  { id: 3, name: 'Grace', role: 'arch' },
];

describe('DataTable', () => {
  it('renders all rows and column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Grace')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1 + data.length);
  });

  it('cycles sort state asc → desc → null when a sortable header is clicked', () => {
    const spy = vi.fn();
    function Host() {
      const [sort, setSort] = useState<SortState | null>(null);
      return (
        <DataTable
          columns={columns}
          data={data}
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
            spy(next);
          }}
        />
      );
    }
    render(<Host />);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(spy).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });
    fireEvent.click(nameHeader);
    expect(spy).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    fireEvent.click(nameHeader);
    expect(spy).toHaveBeenLastCalledWith(null);
  });

  it('announces sort direction via aria-sort on the active header', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        sort={{ key: 'name', direction: 'asc' }}
        onSortChange={() => {}}
      />,
    );
    const header = screen.getByText('Name').closest('th')!;
    expect(header).toHaveAttribute('aria-sort', 'ascending');
  });

  it('does not render sort UI if onSortChange is missing', () => {
    render(<DataTable columns={columns} data={data} />);
    const header = screen.getByText('Name').closest('th')!;
    expect(header).not.toHaveAttribute('aria-sort');
  });

  it('selection: toggles a single row', () => {
    const spy = vi.fn();
    function Host() {
      const [sel, setSel] = useState<Array<string | number>>([]);
      return (
        <DataTable
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          selection={sel}
          onSelectionChange={(next) => {
            setSel(next);
            spy(next);
          }}
        />
      );
    }
    render(<Host />);
    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /Select row/i });
    fireEvent.click(rowCheckboxes[0]);
    expect(spy).toHaveBeenLastCalledWith([1]);
    fireEvent.click(rowCheckboxes[1]);
    expect(spy).toHaveBeenLastCalledWith([1, 2]);
  });

  it('selection: select-all toggles every visible row and deselects when all are checked', () => {
    const spy = vi.fn();
    function Host() {
      const [sel, setSel] = useState<Array<string | number>>([]);
      return (
        <DataTable
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          selection={sel}
          onSelectionChange={(next) => {
            setSel(next);
            spy(next);
          }}
        />
      );
    }
    render(<Host />);
    const selectAll = screen.getByLabelText(/Select all rows/i);
    fireEvent.click(selectAll);
    expect(spy).toHaveBeenLastCalledWith([1, 2, 3]);
    const deselectAll = screen.getByLabelText(/Deselect all rows/i);
    fireEvent.click(deselectAll);
    expect(spy).toHaveBeenLastCalledWith([]);
  });

  it('renders the empty state', () => {
    render(<DataTable columns={columns} data={[]} emptyText="Nothing to see" />);
    expect(screen.getByText('Nothing to see')).toBeInTheDocument();
  });

  it('renders skeleton rows while loading', () => {
    const { container } = render(<DataTable columns={columns} data={[]} loading />);
    const skeletonRows = container.querySelectorAll('tr.animate-pulse');
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it('fires onRowClick with the row object', () => {
    const spy = vi.fn();
    render(
      <DataTable columns={columns} data={data} getRowId={(r) => r.id} onRowClick={spy} />,
    );
    const adaRow = screen.getByText('Ada').closest('tr')!;
    fireEvent.click(adaRow);
    expect(spy).toHaveBeenCalledWith(data[0], 0);
  });

  it('checkbox click does not trigger onRowClick', () => {
    const onRow = vi.fn();
    const onSel = vi.fn();
    function Host() {
      const [sel, setSel] = useState<Array<string | number>>([]);
      return (
        <DataTable
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          selection={sel}
          onSelectionChange={(next) => {
            setSel(next);
            onSel(next);
          }}
          onRowClick={onRow}
        />
      );
    }
    render(<Host />);
    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /Select row/i });
    fireEvent.click(rowCheckboxes[0]);
    expect(onSel).toHaveBeenCalled();
    expect(onRow).not.toHaveBeenCalled();
  });

  it('uses the render prop when provided', () => {
    const cols: DataTableColumn<Row>[] = [
      {
        key: 'name',
        header: 'N',
        render: (r) => <span data-testid={`cell-${r.id}`}>HI-{r.name}</span>,
      },
    ];
    render(<DataTable columns={cols} data={data} />);
    const cell = screen.getByTestId('cell-1');
    expect(within(cell.parentElement!).getByText('HI-Ada')).toBeInTheDocument();
  });
});
