import type { Meta, StoryObj } from "@storybook/react";
import PricingTable from "./PricingTable";

const meta = {
  title: "Marketing/PricingTable",
  component: PricingTable,
  tags: ["autodocs"],
} satisfies Meta<typeof PricingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    plans: [
      {
        name: "Starter",
        price: "$0",
        period: "/mo",
        tagline: "For side projects and prototypes.",
        features: ["Up to 3 projects", "Community support", "Core components"],
      },
      {
        name: "Pro",
        price: "$29",
        period: "/mo",
        yearlyPrice: "$290",
        tagline: "For growing product teams.",
        features: ["Unlimited projects", "Priority support", "Advanced charts", "Theme tokens"],
        featured: true,
        badge: "Most popular",
        cta: "Start free trial",
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "/mo",
        yearlyPrice: "$990",
        tagline: "For organizations at scale.",
        features: ["SAML SSO", "Dedicated support", "Audit logs", "Custom SLAs"],
        cta: "Contact sales",
      },
    ],
  },
};

export const NoToggle: Story = {
  args: { ...Default.args, showToggle: false },
};
