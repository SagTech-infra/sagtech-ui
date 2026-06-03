import { forwardRef } from "react";
import classNames from "classnames";

export interface FeatureItem {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

const COLS: Record<NonNullable<FeatureGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Responsive grid of feature cards (the "why" section of a landing). */
const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ items, columns = 3, className, ...rest }, ref) => (
    <div ref={ref} className={classNames("grid grid-cols-1 gap-16px", COLS[columns], className)} {...rest}>
      {items.map((f, i) => (
        <div
          key={i}
          className="rounded-16px border border-border-default p-24px transition-colors hover:border-border-strong hover:bg-surface-wash"
          style={{ transitionTimingFunction: "var(--motion-ease-tech)" }}
        >
          {f.icon && <div className="mb-12px text-pr_purple">{f.icon}</div>}
          <p className="font-display text-18 text-fg-primary">{f.title}</p>
          <p className="mt-8px text-14 leading-24 text-fg-muted">{f.description}</p>
        </div>
      ))}
    </div>
  ),
);

FeatureGrid.displayName = "FeatureGrid";
export default FeatureGrid;
