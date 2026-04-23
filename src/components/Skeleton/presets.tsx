import classNames from 'classnames';
import Skeleton from './Skeleton';

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return <Skeleton count={lines} height={14} className={className} />;
}

export interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export function SkeletonAvatar({ size = 40, className }: SkeletonAvatarProps) {
  return <Skeleton width={size} height={size} rounded="circle" className={className} />;
}

export interface SkeletonCardProps {
  lines?: number;
  withMedia?: boolean;
  className?: string;
}

export function SkeletonCard({
  lines = 2,
  withMedia = false,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={classNames(
        'bg-black_2 border border-solid border-black_3 rounded-16px p-16px flex flex-col gap-12px',
        className,
      )}
    >
      {withMedia && <Skeleton height={120} />}
      <Skeleton height={18} width="60%" />
      <SkeletonText lines={lines} />
    </div>
  );
}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={classNames(
        'bg-black_1 border border-solid border-black_3 rounded-16px overflow-hidden',
        className,
      )}
    >
      <div className="grid border-b border-solid border-black_3 bg-black_2 px-16px py-12px gap-12px" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} height={12} width="60%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`r-${r}`}
          className="grid border-b border-solid border-black_3 last:border-b-0 px-16px py-12px gap-12px"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={`c-${r}-${c}`} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface SkeletonListProps {
  items?: number;
  withAvatar?: boolean;
  className?: string;
}

export function SkeletonList({
  items = 4,
  withAvatar = true,
  className,
}: SkeletonListProps) {
  return (
    <div className={classNames('flex flex-col gap-12px', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-12px">
          {withAvatar && <SkeletonAvatar size={40} />}
          <div className="flex-1 flex flex-col gap-6px">
            <Skeleton height={14} width="40%" />
            <Skeleton height={12} width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}
