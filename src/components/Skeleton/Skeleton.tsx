import classNames from 'classnames';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'rect' | 'circle' | 'pill';
  count?: number;
  className?: string;
}

const roundedMap = {
  rect: 'rounded-8px',
  circle: 'rounded-[50%]',
  pill: 'rounded-circle',
} as const;

export default function Skeleton({
  width,
  height,
  rounded = 'rect',
  count = 1,
  className,
}: SkeletonProps) {
  const baseClasses = classNames(
    'animate-pulse bg-gradient-to-r from-black_2 to-black_3',
    roundedMap[rounded],
    className,
  );

  const resolveStyle = (index: number): React.CSSProperties => {
    const isLastLine = count > 1 && index === count - 1;

    return {
      width: isLastLine ? '75%' : width,
      height: height ?? (rounded === 'circle' ? width : 16),
    };
  };

  if (count <= 1) {
    return <div className={baseClasses} style={resolveStyle(0)} />;
  }

  return (
    <div className="flex flex-col gap-8px">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={baseClasses} style={resolveStyle(i)} />
      ))}
    </div>
  );
}
