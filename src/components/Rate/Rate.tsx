'use client';

import classNames from 'classnames';

export interface RateProps {
  /** Current score (0..max). */
  value: number;
  /** Maximum score. Defaults to 5. */
  max?: number;
  /** Pixel size of each star. Defaults to 20. */
  size?: number;
  /** Override the tone. When omitted, tone is derived from `value / max`. */
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  /** Label describing what's being rated (for screen readers). */
  label?: string;
  className?: string;
}

function Star({ fillPercent, size, color }: { fillPercent: number; size: number; color: string }) {
  const gradientId = `rate-${Math.random().toString(36).slice(2, 9)}`;
  const stops = [
    { offset: '0%', color },
    { offset: `${fillPercent}%`, color },
    { offset: `${fillPercent}%`, color: 'rgba(255,255,255,0.12)' },
    { offset: '100%', color: 'rgba(255,255,255,0.12)' },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId}>
          {stops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

export default function Rate({
  value,
  max = 5,
  size = 20,
  tone,
  label,
  className,
}: RateProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const ratio = clamped / max;
  const derivedTone = tone
    ? tone
    : ratio >= 0.8
      ? 'success'
      : ratio >= 0.4
        ? 'warning'
        : 'error';
  const colorMap = {
    success: '#58A61B',
    warning: '#C6A328',
    error: '#992D2D',
    neutral: '#B5B5B9',
  };
  const color = colorMap[derivedTone];

  return (
    <div
      className={classNames('inline-flex items-center gap-4px', className)}
      role="img"
      aria-label={
        label ? `${label}: ${clamped} out of ${max}` : `Rating: ${clamped} out of ${max}`
      }
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const fillPercent =
          clamped >= starValue ? 100 : clamped > index ? (clamped - index) * 100 : 0;
        return <Star key={index} fillPercent={fillPercent} size={size} color={color} />;
      })}
    </div>
  );
}
