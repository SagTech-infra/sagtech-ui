import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Calendar from "./Calendar";

const meta = {
  title: "Data Display/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-black_2 rounded-16px p-20px inline-block">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: new Date(),
  },
};

export const Interactive: Story = {
  render: function InteractiveCalendar() {
    const [date, setDate] = useState<Date>(new Date());
    return <Calendar value={date} onChange={setDate} />;
  },
};

export const WithMinMax: Story = {
  args: {
    value: new Date(),
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
};

export const GermanLocale: Story = {
  args: {
    value: new Date(),
    locale: "de-DE",
  },
};
