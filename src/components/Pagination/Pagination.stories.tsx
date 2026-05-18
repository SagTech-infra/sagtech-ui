import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";

const meta = {
  title: "Data Display/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    mode: { control: { type: "select" }, options: ["offset", "cursor"] },
    size: { control: { type: "select" }, options: ["default", "compact"] },
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

// ─── Offset mode (existing) ──────────────────────────────────────────────────

export const OffsetMode: Story = {
  name: "Offset Mode",
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
          Current page:{" "}
          <span className="text-white_4 font-semibold">{page}</span>
        </p>
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      </div>
    );
  },
};

// ─── Cursor mode (new) ───────────────────────────────────────────────────────

export const CursorMode: Story = {
  name: "Cursor Mode",
  args: {
    mode: "cursor",
    hasPrevious: true,
    hasNext: true,
    label: "Showing 1–20 of 156",
    onPreviousPage: () => {},
    onNextPage: () => {},
  },
};

export const CursorModeNoPrevious: Story = {
  name: "Cursor Mode — No Previous",
  args: {
    mode: "cursor",
    hasPrevious: false,
    hasNext: true,
    label: "Showing 1–20 of 156",
    onPreviousPage: () => {},
    onNextPage: () => {},
  },
};

export const CursorModeNoNext: Story = {
  name: "Cursor Mode — No Next",
  args: {
    mode: "cursor",
    hasPrevious: true,
    hasNext: false,
    label: "Showing 141–156 of 156",
    onPreviousPage: () => {},
    onNextPage: () => {},
  },
};

// ─── Shared states ───────────────────────────────────────────────────────────

export const Loading: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    loading: true,
    onPageChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    disabled: true,
    onPageChange: () => {},
  },
};

export const Compact: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "compact",
    onPageChange: () => {},
  },
};

export const WithLabel: Story = {
  name: "With Label (Offset)",
  args: {
    currentPage: 3,
    totalPages: 10,
    label: "Showing 21–30 of 100",
    onPageChange: () => {},
  },
};
