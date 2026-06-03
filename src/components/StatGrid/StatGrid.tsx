"use client";

import { forwardRef } from "react";
import classNames from "classnames";
import NumberTicker from "../NumberTicker/NumberTicker";

export interface StatItem {
  value: number;
  label: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StatItem[];
}

/** Row of headline numbers that count up on scroll (via NumberTicker). */
const StatGrid = forwardRef<HTMLDivElement, StatGridProps>(({ items, className, ...rest }, ref) => (
  <div ref={ref} className={classNames("grid grid-cols-2 gap-16px md:grid-cols-4", className)} {...rest}>
    {items.map((s, i) => (
      <div key={i} className="rounded-16px border border-border-default p-24px text-center">
        <div className="font-display text-40 text-fg-primary">
          {s.prefix}
          <NumberTicker value={s.value} />
          {s.suffix}
        </div>
        <p className="mt-4px text-14 text-fg-muted">{s.label}</p>
      </div>
    ))}
  </div>
));

StatGrid.displayName = "StatGrid";
export default StatGrid;
