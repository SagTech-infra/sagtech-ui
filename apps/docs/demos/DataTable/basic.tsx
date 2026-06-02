'use client';
import { DataTable, Badge } from '@sagtech-infra/ui';
import type { DataTableColumn } from '@sagtech-infra/ui';

interface Row {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'paused' | 'archived';
  created: string;
}

const data: Row[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active', created: '2026-01-12' },
  { id: 2, name: 'Alan Turing', role: 'Researcher', status: 'paused', created: '2026-02-04' },
  { id: 3, name: 'Grace Hopper', role: 'Architect', status: 'active', created: '2025-11-29' },
  { id: 4, name: 'Margaret Hamilton', role: 'Engineer', status: 'archived', created: '2025-10-01' },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '30%' },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (row) => {
      const color = row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'grey';
      return (
        <Badge variant="subtle" color={color} size="sm" dot>
          {row.status}
        </Badge>
      );
    },
  },
  { key: 'created', header: 'Created', sortable: true, align: 'right' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[720px]">
      <DataTable columns={columns} data={data} getRowId={(r) => r.id} />
    </div>
  );
}
