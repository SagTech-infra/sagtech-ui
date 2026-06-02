'use client';
import { Table } from '@sagtech-infra/ui';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true, align: 'right' as const },
];

const data = [
  { name: 'Alex Johnson', role: 'Frontend Developer', department: 'Engineering', joined: '2024-01-15' },
  { name: 'Maria Garcia', role: 'Backend Developer', department: 'Engineering', joined: '2023-08-20' },
  { name: 'James Wilson', role: 'Product Designer', department: 'Design', joined: '2023-03-10' },
  { name: 'Sophie Chen', role: 'QA Engineer', department: 'Engineering', joined: '2024-02-01' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[720px]">
      <Table columns={columns} data={data} striped hoverable />
    </div>
  );
}
