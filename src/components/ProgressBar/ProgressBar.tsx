import classNames from 'classnames';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'blue' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const heightMap = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

const colorMap = {
  purple: 'bg-pr_purple',
  blue: 'bg-pr_blue',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
} as const;

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'purple',
  showLabel = false,
  label,
  animated = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = Math.round((clampedValue / max) * 100);
  const height = heightMap[size];

  return (
    <div className={classNames('w-full', className)}>
      {showLabel && (
        <div className="flex justify-end mb-4px">
          <span className="text-grey_4 text-12 font-manrope">
            {label || `${percentage}%`}
          </span>
        </div>
      )}
      <div
        className="bg-black_3 rounded-full overflow-hidden w-full"
        style={{ height }}
      >
        <div
          className={classNames(
            'rounded-full transition-all duration-500 relative overflow-hidden h-full',
            colorMap[color],
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
