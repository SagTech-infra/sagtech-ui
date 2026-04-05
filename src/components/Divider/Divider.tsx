import classNames from 'classnames';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'gradient' | 'dashed';
  className?: string;
  label?: string;
}

export default function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  className,
  label,
}: DividerProps) {
  const isVertical = orientation === 'vertical';

  if (isVertical) {
    return (
      <div
        className={classNames(
          'self-stretch',
          {
            'w-[1px] bg-black_3': variant === 'solid',
            'w-[1px] bg-gradient-to-b from-transparent via-pr_purple to-transparent':
              variant === 'gradient',
            'w-[1px] border-l border-dashed border-black_3': variant === 'dashed',
          },
          className,
        )}
      />
    );
  }

  if (label) {
    return (
      <div className={classNames('flex items-center gap-12px w-full', className)}>
        <div
          className={classNames('flex-1 h-[1px]', {
            'bg-black_3': variant === 'solid',
            'bg-gradient-to-r from-transparent to-pr_purple': variant === 'gradient',
            'border-t border-dashed border-black_3 bg-transparent': variant === 'dashed',
          })}
        />
        <span className="text-grey_2 text-12 font-manrope whitespace-nowrap">{label}</span>
        <div
          className={classNames('flex-1 h-[1px]', {
            'bg-black_3': variant === 'solid',
            'bg-gradient-to-r from-pr_purple to-transparent': variant === 'gradient',
            'border-t border-dashed border-black_3 bg-transparent': variant === 'dashed',
          })}
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'w-full',
        {
          'h-[1px] bg-black_3': variant === 'solid',
          'h-[1px] bg-gradient-to-r from-transparent via-pr_purple to-transparent':
            variant === 'gradient',
          'h-0 border-t border-dashed border-black_3': variant === 'dashed',
        },
        className,
      )}
    />
  );
}
