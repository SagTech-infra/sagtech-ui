import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Pagination from './Pagination';

const meta = {
  title: 'Data Display/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
  decorators: [
    (Story) => (
      <div className="bg-black_1 p-24px rounded-16px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    onPageChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div className="flex flex-col gap-16px">
        <p className="font-manrope text-14 text-grey_4">
          Current page: <span className="text-white_4 font-semibold">{page}</span>
        </p>
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      </div>
    );
  },
};
