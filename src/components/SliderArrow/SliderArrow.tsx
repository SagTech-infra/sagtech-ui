import cn from 'classnames';
import { Icon } from '@/components/Icon/Icon';

type Props = {
  isReversed?: boolean;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
};

function SliderArrow({ onClick, isReversed = false, isDisabled, className }: Props) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        'flex-shrink-0 transition-opacity duration-300 hover:opacity-60',
        isReversed && 'relative rotate-180',
        isDisabled && 'opacity-50',
        className,
      )}
      onClick={onClick}
      aria-label="navigation"
    >
      <Icon size={40} height={40} viewBox="0 0 40 40" icon="button" />
    </button>
  );
}

export default SliderArrow;
