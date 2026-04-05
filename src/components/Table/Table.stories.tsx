import type { Meta, StoryObj } from '@storybook/react';
import Table from './Table';
import Badge from '@/components/Badge/Badge';

interface Employee {
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'on leave';
  joined: string;
  department: string;
}

const sampleColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (val: string) => {
      const colorMap = {
        active: 'success',
        inactive: 'error',
        'on leave': 'warning',
      } as const;
      return (
        <Badge variant="subtle" color={colorMap[val as keyof typeof colorMap]} size="sm">
          {val}
        </Badge>
      );
    },
  },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true, align: 'right' as const },
];

const sampleData: Employee[] = [
  { name: 'Alex Johnson', role: 'Frontend Developer', status: 'active', joined: '2024-01-15', department: 'Engineering' },
  { name: 'Maria Garcia', role: 'Backend Developer', status: 'active', joined: '2023-08-20', department: 'Engineering' },
  { name: 'James Wilson', role: 'Product Designer', status: 'on leave', joined: '2023-03-10', department: 'Design' },
  { name: 'Sophie Chen', role: 'QA Engineer', status: 'active', joined: '2024-02-01', department: 'Engineering' },
  { name: 'Liam Brown', role: 'DevOps Engineer', status: 'inactive', joined: '2022-11-05', department: 'Infrastructure' },
  { name: 'Emma Davis', role: 'Technical Writer', status: 'active', joined: '2024-03-18', department: 'Documentation' },
  { name: 'Noah Martinez', role: 'Data Analyst', status: 'active', joined: '2023-06-12', department: 'Analytics' },
  { name: 'Olivia Taylor', role: 'Project Manager', status: 'on leave', joined: '2022-09-30', department: 'Management' },
];

const meta = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    compact: { control: 'boolean' },
    emptyText: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: sampleColumns.map(({ render, ...col }) => col),
    data: sampleData,
  },
};

export const Striped: Story = {
  args: {
    columns: sampleColumns.map(({ render, ...col }) => col),
    data: sampleData,
    striped: true,
  },
};

export const Sortable: Story = {
  args: {
    columns: sampleColumns.map(({ render, ...col }) => col),
    data: sampleData,
  },
  render: (args) => (
    <div>
      <p className="font-manrope text-12 text-grey_2 mb-16px">
        Click on column headers with arrows to sort
      </p>
      <Table {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: {
    columns: sampleColumns.map(({ render, ...col }) => col),
    data: sampleData,
    compact: true,
  },
};

export const WithCustomRender: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData,
  },
};

export const Empty: Story = {
  args: {
    columns: sampleColumns.map(({ render, ...col }) => col),
    data: [],
    emptyText: 'No employees found',
  },
};
