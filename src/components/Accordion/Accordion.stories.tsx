import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Accordion, AccordionItem } from "./Accordion";

const meta = {
  title: "Data Display/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { value: "shipping", label: "Shipping", body: "Orders ship within 2 days." },
  { value: "returns", label: "Returns", body: "Return within 30 days." },
  { value: "support", label: "Support", body: "Reach us 24/7 via chat." },
];

export const Single: Story = {
  args: { type: "single", defaultValue: ["shipping"] },
  render: (args) => (
    <div className="w-[420px]">
      <Accordion {...args}>
        {items.map((it) => (
          <AccordionItem key={it.value} value={it.value} label={it.label}>
            {it.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["shipping", "support"] },
  render: (args) => (
    <div className="w-[420px]">
      <Accordion {...args}>
        {items.map((it) => (
          <AccordionItem key={it.value} value={it.value} label={it.label}>
            {it.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  args: { type: "single" },
  render: (args) => (
    <div className="w-[420px]">
      <Accordion {...args}>
        <AccordionItem value="shipping" label="Shipping">
          Orders ship within 2 days.
        </AccordionItem>
        <AccordionItem value="returns" label="Returns (unavailable)" disabled>
          Return within 30 days.
        </AccordionItem>
        <AccordionItem value="support" label="Support">
          Reach us 24/7 via chat.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Controlled: Story = {
  args: { type: "multiple" },
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<string[]>(["shipping"]);
      return (
        <div className="flex w-[420px] flex-col gap-12px">
          <Accordion type="multiple" value={value} onValueChange={setValue}>
            {items.map((it) => (
              <AccordionItem key={it.value} value={it.value} label={it.label}>
                {it.body}
              </AccordionItem>
            ))}
          </Accordion>
          <span className="font-manrope text-12 text-fg-muted">
            open: {value.join(", ") || "none"}
          </span>
        </div>
      );
    };
    return <Demo />;
  },
};
