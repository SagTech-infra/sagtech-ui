import classNames from 'classnames';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'subtle';
  color?: 'purple' | 'blue' | 'success' | 'warning' | 'error' | 'grey';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const filledColorMap = {
  purple: 'bg-pr_purple text-white',
  blue: 'bg-pr_blue text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-black_1',
  error: 'bg-error text-white',
  grey: 'bg-black_3 text-fg-muted',
} as const;

const outlinedColorMap = {
  purple: 'border border-pr_purple text-pr_purple',
  blue: 'border border-pr_blue text-pr_blue',
  success: 'border border-success text-success',
  warning: 'border border-warning text-warning',
  error: 'border border-error text-error',
  grey: 'border border-black_3 text-fg-muted',
} as const;

const subtleColorMap = {
  purple: 'bg-pr_purple/10 text-pr_purple',
  blue: 'bg-pr_blue/10 text-pr_blue',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  grey: 'bg-black_3/10 text-fg-muted',
} as const;

const sizeMap = {
  sm: 'text-12 py-[3px] px-10px',
  md: 'text-14 py-4px px-12px',
} as const;

export default function Badge({
  children,
  variant = 'filled',
  color = 'purple',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  const variantClasses =
    variant === 'filled'
      ? filledColorMap[color]
      : variant === 'outlined'
        ? outlinedColorMap[color]
        : subtleColorMap[color];

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-4px rounded-circle font-manrope font-semibold',
        sizeMap[size],
        variantClasses,
        className,
      )}
    >
      {/* The dot inherits the badge's text color (bg-current) so it always
          contrasts with the variant's background — on a filled badge a same-
          color dot would be invisible (e.g. amber dot on an amber fill). */}
      {dot && <span className="w-[6px] h-[6px] rounded-[50%] bg-current" />}
      {children}
    </span>
  );
}
