import type { Meta, StoryObj } from "@storybook/react";
import AuroraHero from "./AuroraHero";
import Button from "../Button/Button";

const meta = {
  title: "Marketing/AuroraHero",
  component: AuroraHero,
  tags: ["autodocs"],
} satisfies Meta<typeof AuroraHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "Now in public beta",
    title: "Launch your product at light speed",
    subtitle:
      "A dark-first React + Tailwind component library engineered for sci-fi grade interfaces.",
    actions: (
      <>
        <Button variant="primary" text="Start building" />
        <Button variant="secondary" text="View docs" />
      </>
    ),
    stats: [
      { value: "107+", label: "Components" },
      { value: "749", label: "Tests" },
      { value: "12", label: "Charts" },
    ],
  },
};

export const Left: Story = {
  args: { ...Default.args, align: "left" },
};
