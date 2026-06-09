"use client";

import { useState } from "react";
import classNames from "classnames";
import Button from "@/components/Button/Button";
import CardWrapper from "@/components/CardWrapper/CardWrapper";
import Badge from "@/components/Badge/Badge";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";

export interface PricingPlan {
  name: string;
  /** e.g. "$0" or "$29". */
  price: string;
  /** e.g. "/mo". */
  period?: string;
  /** Optional price shown when the billing interval is yearly. */
  yearlyPrice?: string;
  tagline?: string;
  features: string[];
  /** Button label, default "Get started". */
  cta?: string;
  featured?: boolean;
  /** Pill shown top-right of a featured card, e.g. "Most popular". */
  badge?: string;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  /** Render a Monthly/Yearly toggle above the grid. Default true. */
  showToggle?: boolean;
  onSelect?: (plan: PricingPlan) => void;
  className?: string;
}

type Interval = "monthly" | "yearly";

const CheckIcon = () => (
  <svg
    className="mt-[2px] h-16px w-16px shrink-0 text-pr_purple"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M13.5 4.5 6.5 11.5 3 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** SaaS-style pricing grid: plan cards with one featured plan and an optional billing toggle. */
export default function PricingTable({
  plans,
  showToggle = true,
  onSelect,
  className,
}: PricingTableProps) {
  const [interval, setInterval] = useState<Interval>("monthly");
  const yearly = interval === "yearly";

  return (
    <div className={classNames("w-full", className)}>
      {showToggle && (
        <div className="mb-32px flex justify-center">
          <SegmentedControl
            aria-label="Billing interval"
            value={interval}
            onChange={(next) => setInterval(next as Interval)}
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Yearly", value: "yearly" },
            ]}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-24px md:grid-cols-3">
        {plans.map((plan, i) => {
          const price =
            yearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
          return (
            <CardWrapper
              key={i}
              rounded="24"
              className={classNames(
                "relative flex flex-col p-24px",
                plan.featured
                  ? "border-pr_purple bg-surface-wash shadow-3xl"
                  : "border-border-default",
              )}
            >
              {plan.featured && plan.badge && (
                <span className="absolute right-24px top-24px">
                  <Badge color="purple" variant="filled" size="sm">
                    {plan.badge}
                  </Badge>
                </span>
              )}

              <p className="font-orbitron text-18 text-fg-primary">{plan.name}</p>
              {plan.tagline && (
                <p className="mt-8px text-14 text-fg-muted">{plan.tagline}</p>
              )}

              <div className="mt-24px flex items-baseline gap-4px">
                <span className="font-orbitron text-40 text-fg-primary tabular-nums">
                  {price}
                </span>
                {plan.period && (
                  <span className="text-16 text-fg-muted">{plan.period}</span>
                )}
              </div>

              <ul className="mt-24px flex flex-col gap-12px">
                {plan.features.map((feature, fi) => (
                  <li
                    key={fi}
                    className="flex items-start gap-8px text-14 text-fg-secondary"
                  >
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-32px pt-24px">
                <Button
                  variant={plan.featured ? "primary" : "secondary"}
                  text={plan.cta ?? "Get started"}
                  classes="w-full justify-center"
                  onClick={() => onSelect?.(plan)}
                />
              </div>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
}
