import type { Meta, StoryObj } from "@storybook/react";
import JsonView from "./JsonView";

const meta = {
  title: "Data Display/JsonView",
  component: JsonView,
  tags: ["autodocs"],
  argTypes: {
    collapsed: { control: "number" },
    copy: { control: "boolean" },
    indent: { control: "number" },
  },
} satisfies Meta<typeof JsonView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleObject = {
  id: 1,
  name: "SagTech UI",
  version: "1.3.0",
  active: true,
};

export const Default: Story = {
  args: {
    data: sampleObject,
    collapsed: 1,
  },
};

export const Nested: Story = {
  args: {
    collapsed: 2,
    data: {
      project: {
        id: 42,
        meta: {
          createdAt: "2026-01-01",
          tags: ["ui", "library", "react"],
          author: {
            name: "Andrew",
            email: "andrew@sagtech.io",
          },
        },
        settings: {
          theme: "dark",
          locale: "en-US",
          features: {
            notifications: true,
            analytics: false,
          },
        },
      },
    },
  },
};

export const Primitives: Story = {
  args: {
    collapsed: false,
    data: {
      string: "hello world",
      number: 3.14,
      integer: 42,
      boolTrue: true,
      boolFalse: false,
      nil: null,
    },
  },
};

export const Array: Story = {
  args: {
    collapsed: 1,
    data: [
      { id: 1, role: "admin", active: true },
      { id: 2, role: "member", active: false },
      { id: 3, role: "viewer", active: true },
    ],
  },
};

export const NoCopy: Story = {
  args: {
    copy: false,
    collapsed: false,
    data: sampleObject,
  },
};
