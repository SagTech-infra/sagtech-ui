import { forwardRef } from "react";
import classNames from "classnames";

export interface AuroraStat {
  value: string;
  label: string;
}

export interface AuroraHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Small label above the title. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Buttons / links row. */
  actions?: React.ReactNode;
  /** Optional stat strip rendered under the actions. */
  stats?: AuroraStat[];
  align?: "center" | "left";
}

/**
 * Rich marketing hero with a blurred color-blob mesh and a faint dot-grid
 * backdrop, adapted to the dark/purple brand. Theme-aware via design tokens.
 */
const AuroraHero = forwardRef<HTMLElement, AuroraHeroProps>(function AuroraHero(
  { eyebrow, title, subtitle, actions, stats, align = "center", className, ...rest },
  ref,
) {
  const centered = align === "center";
  return (
    <section
      ref={ref}
      className={classNames(
        "relative isolate overflow-hidden px-24px py-[96px] sm:py-[120px]",
        centered && "text-center",
        className,
      )}
      {...rest}
    >
      {/* Decorative blob mesh + dot-grid, kept behind content and inert. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -left-[120px] -top-[80px] h-[460px] w-[460px] rounded-full bg-sec_purple/30 blur-[90px]" />
        <span className="absolute -right-[100px] -top-[40px] h-[420px] w-[420px] rounded-full bg-pr_blue/30 blur-[90px]" />
        <span className="absolute -bottom-[120px] left-[10%] h-[440px] w-[440px] rounded-full bg-sec_blue/25 blur-[90px]" />
        <span className="absolute -bottom-[80px] right-[8%] h-[420px] w-[420px] rounded-full bg-pr_purple/25 blur-[90px]" />
        <span className="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-sec_purple/20 blur-[90px]" />
        <div
          className="absolute inset-0 text-fg-primary opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className={classNames("relative max-w-[860px]", centered && "mx-auto")}>
        {eyebrow && (
          <span className="inline-flex items-center gap-8px rounded-full border border-pr_purple/30 bg-surface-wash px-12px py-4px font-orbitron text-12 uppercase tracking-wider text-sec_purple">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sec_purple opacity-75" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-sec_purple" />
            </span>
            {eyebrow}
          </span>
        )}
        <h1 className="mt-16px font-orbitron text-40 leading-[1.05] text-fg-primary sm:text-[56px]">
          {title}
        </h1>
        {subtitle && (
          <p
            className={classNames(
              "mt-16px max-w-[640px] text-18 text-fg-secondary",
              centered && "mx-auto",
            )}
          >
            {subtitle}
          </p>
        )}
        {actions && (
          <div
            className={classNames(
              "mt-32px flex flex-wrap gap-12px",
              centered && "justify-center",
            )}
          >
            {actions}
          </div>
        )}
        {stats && stats.length > 0 && (
          <div
            className={classNames(
              "mt-48px flex flex-wrap gap-x-[48px] gap-y-24px",
              centered && "justify-center",
            )}
          >
            {stats.map((stat, i) => (
              <div key={i} className={classNames(centered && "text-center")}>
                <div className="font-orbitron text-28 text-fg-primary tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-4px text-14 text-fg-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

AuroraHero.displayName = "AuroraHero";
export default AuroraHero;
