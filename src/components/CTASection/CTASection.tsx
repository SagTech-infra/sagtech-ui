import { forwardRef } from "react";
import classNames from "classnames";

export interface CTASectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Final call-to-action band on the brand gradient. */
const CTASection = forwardRef<HTMLElement, CTASectionProps>(
  ({ title, subtitle, actions, className, ...rest }, ref) => (
    <section
      ref={ref}
      className={classNames("relative overflow-hidden rounded-24px px-24px py-56px text-center", className)}
      style={{ background: "var(--gradient-hero)" }}
      {...rest}
    >
      <h2 className="font-display text-32 text-white md:text-40">{title}</h2>
      {subtitle && <p className="mx-auto mt-12px max-w-[560px] text-16 text-white/80">{subtitle}</p>}
      {actions && <div className="mt-24px flex flex-wrap justify-center gap-12px">{actions}</div>}
    </section>
  ),
);

CTASection.displayName = "CTASection";
export default CTASection;
