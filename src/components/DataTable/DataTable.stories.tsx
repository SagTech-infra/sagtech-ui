import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import DataTable from './DataTable';
import type { DataTableColumn, SortState } from './types';
import Badge from '@/components/Badge/Badge';

interface Row {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'paused' | 'archived';
  created: string;
}

const baseData: Row[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active', created: '2026-01-12' },
  { id: 2, name: 'Alan Turing', role: 'Researcher', status: 'paused', created: '2026-02-04' },
  { id: 3, name: 'Grace Hopper', role: 'Architect', status: 'active', created: '2025-11-29' },
  { id: 4, name: 'Margaret Hamilton', role: 'Engineer', status: 'archived', created: '2025-10-01' },
  { id: 5, name: 'Katherine Johnson', role: 'Analyst', status: 'active', created: '2026-03-18' },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '30%' },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => {
      const color =
        row.status === 'active'
          ? 'success'
          : row.status === 'paused'
            ? 'warning'
            : 'grey';
      return (
        <Badge variant="subtle" color={color} size="sm" dot>
          {row.status}
        </Badge>
      );
    },
  },
  { key: 'created', header: 'Created', sortable: true, align: 'right' },
];

const meta = {
  title: 'Data Display/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <DataTable columns={columns} data={baseData} getRowId={(r) => r.id} />,
};

export const WithSort: Story = {
  render: function SortStory() {
    const [sort, setSort] = useState<SortState | null>({ key: 'name', direction: 'asc' });
    const sorted = useMemo(() => {
      if (!sort) return baseData;
      const { key, direction } = sort;
      const multiplier = direction === 'asc' ? 1 : -1;
      return [...baseData].sort((a, b) => {
        const av = a[key as keyof Row] as string;
        const bv = b[key as keyof Row] as string;
        if (av < bv) return -1 * multiplier;
        if (av > bv) return 1 * multiplier;
        return 0;
      });
    }, [sort]);
    return (
      <DataTable
        columns={columns}
        data={sorted}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
      />
    );
  },
};

export const WithSelection: Story = {
  render: function SelectStory() {
    const [selection, setSelection] = useState<Array<string | number>>([]);
    return (
      <>
        <div className="text-grey_4 text-14 font-manrope mb-8px">
          Selected: {selection.length} row(s)
        </div>
        <DataTable
          columns={columns}
          data={baseData}
          getRowId={(r) => r.id}
          selection={selection}
          onSelectionChange={setSelection}
        />
      </>
    );
  },
};

export const StickyHeader: Story = {
  render: () => {
    const longData = Array.from({ length: 40 }, (_, i) => ({
      ...baseData[i % baseData.length],
      id: i + 1,
    }));
    return (
      <DataTable
        columns={columns}
        data={longData}
        getRowId={(r) => r.id}
        stickyHeader
        maxHeight="400px"
      />
    );
  },
};

export const Loading: Story = {
  render: () => <DataTable columns={columns} data={[]} loading />,
};

export const Empty: Story = {
  render: () => (
    <DataTable columns={columns} data={[]} emptyText="Nothing here yet — invite a teammate." />
  ),
};

export const Compact: Story = {
  render: () => <DataTable columns={columns} data={baseData} getRowId={(r) => r.id} compact />,
};

export const RowClick: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={baseData}
      getRowId={(r) => r.id}
      onRowClick={(row) => alert(`Clicked ${row.name}`)}
    />
  ),
};
