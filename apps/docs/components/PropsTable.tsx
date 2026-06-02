'use client';

import type { ReactNode } from 'react';
import { Table } from '@sagtech-infra/ui';
import propsData from '@/content/props.generated.json';

interface PropRow {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

const columns = [
  {
    key: 'name',
    label: 'Prop',
    width: '18%',
    render: (v: unknown): ReactNode => <code className="text-sec_purple">{String(v)}</code>,
  },
  {
    key: 'type',
    label: 'Type',
    width: '30%',
    render: (v: unknown): ReactNode => (
      <code className="text-white_1 text-12">{String(v)}</code>
    ),
  },
  {
    key: 'required',
    label: 'Required',
    width: '10%',
    align: 'center' as const,
    render: (v: unknown): ReactNode => (v ? 'yes' : '—'),
  },
  {
    key: 'defaultValue',
    label: 'Default',
    width: '14%',
    render: (v: unknown): ReactNode => (
      <code className="text-grey_3">{v == null ? '—' : String(v)}</code>
    ),
  },
  { key: 'description', label: 'Description' },
];

export function PropsTable({ name }: { name: string }) {
  const rows = ((propsData as Record<string, PropRow[]>)[name] ??
    []) as unknown as Array<Record<string, unknown>>;

  if (!rows.length) {
    return (
      <p className="text-grey_3 text-14">No props metadata generated for {name}.</p>
    );
  }

  return <Table columns={columns as never} data={rows} compact />;
}
