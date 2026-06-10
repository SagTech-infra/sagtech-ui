import classNames from 'classnames';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'inline' | 'card';
  className?: string;
}

function DefaultIcon() {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 16L24 6L40 16V32L24 42L8 32V16Z"
        stroke="#6A6A73"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M8 16L24 26M24 26L40 16M24 26V42"
        stroke="#6A6A73"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M16 11L32 21"
        stroke="#6A6A73"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'inline',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center text-center py-48px px-24px',
        variant === 'card' && 'bg-black_2 border border-solid border-black_3 rounded-16px',
        className,
      )}
    >
      {icon || <DefaultIcon />}
      <h3 className="font-manrope text-18 font-semibold text-fg-primary mt-16px">
        {title}
      </h3>
      {description && (
        <p className="font-manrope text-14 text-fg-muted mt-8px max-w-[360px]">
          {description}
        </p>
      )}
      {action && <div className="mt-24px">{action}</div>}
    </div>
  );
}
