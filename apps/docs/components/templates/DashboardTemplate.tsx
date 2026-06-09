'use client';

import { useMemo, useState } from 'react';
import {
  Sidebar,
  StatCard,
  DataTable,
  Badge,
  Avatar,
  Pagination,
  CardWrapper,
  type SidebarItem,
  type DataTableColumn,
  type SortState,
} from '@sagtech-infra/ui';
import { AreaChart, BarChart, DonutChart } from '@sagtech-infra/ui/charts';

const navIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const navItems: SidebarItem[] = [
  { label: 'Overview', icon: navIcon, href: '#', active: true },
  { label: 'Orders', icon: navIcon, href: '#', badge: 24 },
  { label: 'Customers', icon: navIcon, href: '#' },
  { label: 'Products', icon: navIcon, href: '#' },
  { label: 'Reports', icon: navIcon, href: '#' },
  { label: 'Settings', icon: navIcon, href: '#' },
];

const revenueSeries = [
  {
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 42 },
      { x: 'Feb', y: 55 },
      { x: 'Mar', y: 48 },
      { x: 'Apr', y: 64 },
      { x: 'May', y: 72 },
      { x: 'Jun', y: 81 },
    ],
  },
  {
    name: 'Refunds',
    data: [
      { x: 'Jan', y: 8 },
      { x: 'Feb', y: 11 },
      { x: 'Mar', y: 9 },
      { x: 'Apr', y: 14 },
      { x: 'May', y: 12 },
      { x: 'Jun', y: 15 },
    ],
  },
];

const channelSeries = [
  {
    name: 'Sales',
    data: [
      { x: 'Direct', y: 320 },
      { x: 'Search', y: 540 },
      { x: 'Social', y: 410 },
      { x: 'Email', y: 280 },
      { x: 'Affiliate', y: 190 },
    ],
  },
];

const donutColors = [
  { bgColor: '#6D3EF1', color: '#FFFFFF' },
  { bgColor: '#9271EE', color: '#FFFFFF' },
  { bgColor: '#CBBCF8', color: '#000000' },
  { bgColor: '#4A2AAF', color: '#FFFFFF' },
];

type OrderStatus = 'paid' | 'pending' | 'refunded';

interface OrderRow {
  id: string;
  customer: string;
  plan: string;
  amount: number;
  status: OrderStatus;
}

const orders: OrderRow[] = [
  { id: 'ORD-7781', customer: 'Ada Lovelace', plan: 'Scale', amount: 480, status: 'paid' },
  { id: 'ORD-7782', customer: 'Alan Turing', plan: 'Starter', amount: 49, status: 'pending' },
  { id: 'ORD-7783', customer: 'Grace Hopper', plan: 'Pro', amount: 199, status: 'paid' },
  { id: 'ORD-7784', customer: 'Margaret Hamilton', plan: 'Scale', amount: 480, status: 'refunded' },
  { id: 'ORD-7785', customer: 'Katherine Johnson', plan: 'Pro', amount: 199, status: 'paid' },
  { id: 'ORD-7786', customer: 'Edsger Dijkstra', plan: 'Starter', amount: 49, status: 'pending' },
  { id: 'ORD-7787', customer: 'Barbara Liskov', plan: 'Pro', amount: 199, status: 'paid' },
];

const statusColor: Record<OrderStatus, 'success' | 'warning' | 'error'> = {
  paid: 'success',
  pending: 'warning',
  refunded: 'error',
};

function sortOrders(rows: OrderRow[], sort: SortState | null): OrderRow[] {
  if (!sort) return rows;
  const dir = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[sort.key as keyof OrderRow];
    const bv = b[sort.key as keyof OrderRow];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export default function DashboardTemplate() {
  const [sort, setSort] = useState<SortState | null>({ key: 'amount', direction: 'desc' });
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => sortOrders(orders, sort), [sort]);

  const columns: DataTableColumn<OrderRow>[] = [
    { key: 'id', header: 'Order', sortable: true, width: '20%' },
    { key: 'customer', header: 'Customer', sortable: true },
    { key: 'plan', header: 'Plan', sortable: true },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      align: 'right',
      render: (row) => `$${row.amount.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (row) => (
        <Badge variant="subtle" color={statusColor[row.status]} size="sm" dot>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar
          items={navItems}
          header={
            <span className="font-orbitron text-18 font-bold text-fg-primary">SagTech</span>
          }
          footer={
            <div className="flex items-center gap-12px">
              <Avatar name="Andrew S" size="sm" status="online" />
              <div className="flex flex-col">
                <span className="font-manrope text-14 text-fg-primary leading-16">Andrew S</span>
                <span className="font-manrope text-12 text-fg-muted leading-16">Admin</span>
              </div>
            </div>
          }
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between gap-16px px-24px py-20px border-b border-border-default">
          <div className="flex flex-col gap-4px">
            <h1 className="font-orbitron text-28 font-bold text-fg-primary leading-32">
              Overview
            </h1>
            <p className="font-manrope text-14 text-fg-muted">
              Performance across all channels, last 6 months
            </p>
          </div>
          <div className="flex items-center gap-12px">
            <Avatar src="https://i.pravatar.cc/150?img=12" size="md" status="online" />
          </div>
        </header>

        <main className="flex-1 p-24px flex flex-col gap-24px">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16px">
            <StatCard label="Revenue" value="$362,540" change={{ value: 12.4, direction: 'up' }} />
            <StatCard label="Orders" value="1,284" change={{ value: 8.1, direction: 'up' }} />
            <StatCard
              label="Active Users"
              value="9,431"
              change={{ value: 3.2, direction: 'up' }}
            />
            <StatCard
              label="Churn"
              value="2.1%"
              change={{ value: 0.6, direction: 'down' }}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-16px">
            <CardWrapper className="lg:col-span-2 p-20px">
              <h2 className="font-orbitron text-18 font-semibold text-fg-primary mb-16px">
                Revenue vs Refunds
              </h2>
              <AreaChart series={revenueSeries} width="100%" height={280} stacked />
            </CardWrapper>
            <CardWrapper className="p-20px">
              <h2 className="font-orbitron text-18 font-semibold text-fg-primary mb-16px">
                Traffic Source
              </h2>
              <DonutChart
                value={[38, 27, 22, 13]}
                colors={donutColors}
                labels={['Search', 'Social', 'Direct', 'Email']}
                size={62}
                width={260}
              />
            </CardWrapper>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-16px">
            <CardWrapper className="p-20px">
              <h2 className="font-orbitron text-18 font-semibold text-fg-primary mb-16px">
                Sales by Channel
              </h2>
              <BarChart series={channelSeries} width="100%" height={260} />
            </CardWrapper>
            <CardWrapper className="lg:col-span-2 p-20px">
              <div className="flex items-center justify-between mb-16px">
                <h2 className="font-orbitron text-18 font-semibold text-fg-primary">
                  Recent Orders
                </h2>
                <Badge variant="outlined" color="purple" size="sm">
                  {orders.length} total
                </Badge>
              </div>
              <DataTable
                columns={columns}
                data={sorted}
                getRowId={(row) => row.id}
                sort={sort}
                onSortChange={setSort}
              />
              <div className="mt-16px flex justify-end">
                <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
              </div>
            </CardWrapper>
          </section>
        </main>
      </div>
    </div>
  );
}
