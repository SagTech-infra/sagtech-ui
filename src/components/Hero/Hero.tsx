import { forwardRef } from "react";
import classNames from "classnames";

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Small label above the title. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Buttons / links row. */
  actions?: React.ReactNode;
  /** Decorative background: brand gradient, soft glow, or none. */
  background?: "gradient" | "glow" | "none";
  align?: "left" | "center";
}

/** Marketing hero block — brand display type over an optional gradient/glow. */
const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    { eyebrow, title, subtitle, actions, background = "glow", align = "left", className, ...rest },
    ref,
  ) => {
    const centered = align === "center";
    // On the fixed purple gradient, text must stay light in BOTH themes —
    // theme-flipping tokens (fg-primary / white_1) would go dark in light mode.
    const onGradient = background === "gradient";
    return (
      <section
        ref={ref}
        className={classNames("relative overflow-hidden px-24px py-72px", centered && "text-center", className)}
        {...rest}
      >
        {background !== "none" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: background === "gradient" ? "var(--gradient-hero)" : "var(--gradient-glow)" }}
          />
        )}
        <div className={classNames("relative max-w-[820px]", centered && "mx-auto")}>
          {eyebrow && (
            <p className={classNames(
              "mb-12px font-display text-12 uppercase tracking-widest",
              onGradient ? "text-white/80" : "text-pr_purple",
            )}>{eyebrow}</p>
          )}
          <h1 className={classNames(
            "font-display text-48 leading-56 md:text-64 md:leading-64",
            onGradient ? "text-white" : "text-fg-primary",
          )}>{title}</h1>
          {subtitle && (
            <p className={classNames(
              "mt-16px max-w-[640px] text-18 leading-28",
              onGradient ? "text-white/85" : "text-fg-secondary",
              centered && "mx-auto",
            )}>
              {subtitle}
            </p>
          )}
          {actions && (
            <div className={classNames("mt-32px flex flex-wrap gap-12px", centered && "justify-center")}>{actions}</div>
          )}
        </div>
      </section>
    );
  },
);

Hero.displayName = "Hero";
export default Hero;
