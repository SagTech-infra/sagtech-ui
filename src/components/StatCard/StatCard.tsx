import classNames from 'classnames';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
  className?: string;
}

function ArrowUp() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={classNames(
        'bg-black_2/50 border border-black_3 rounded-16px p-24px relative overflow-hidden hover:shadow-3xl transition-shadow',
        className,
      )}
    >
      <div className="flex flex-col gap-8px">
        <span className="font-manrope text-12 font-semibold text-grey_2 uppercase tracking-wider">
          {label}
        </span>
        <span className="font-orbitron text-32 font-bold text-white_4">
          {value}
        </span>
        {change && (
          <div
            className={classNames('flex items-center gap-4px mt-4px', {
              'text-success': change.direction === 'up',
              'text-error': change.direction === 'down',
            })}
          >
            {change.direction === 'up' ? <ArrowUp /> : <ArrowDown />}
            <span className="text-14 font-semibold font-manrope">
              {change.direction === 'up' ? '+' : '-'}
              {change.value}%
            </span>
          </div>
        )}
      </div>
      {icon && (
        <div className="absolute top-16px right-16px opacity-20 text-pr_purple">
          {icon}
        </div>
      )}
    </div>
  );
}
