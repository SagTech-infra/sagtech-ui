import classnames from 'classnames';
import type { VariantTypoTagsStyles } from '@/components/Typography/types';
import Typography from '@/components/Typography/Typography';
import { useImageComponent } from '@/providers';
import type { VariantTypoColorsText, VariantTypoColorsCircle, VariantTypoIconName } from './types';

interface PointTypes {
  isWrapText?: boolean;
  text: string;
  type: VariantTypoTagsStyles;
  textColor: VariantTypoColorsText;
  circleColor?: VariantTypoColorsCircle;
  styles?: string;
  iconName?: VariantTypoIconName;
  icon?: boolean;
  classes?: string;
}
function Point({
  isWrapText = true,
  text,
  type,
  textColor,
  circleColor = 'bg-pr_purple',
  styles,
  classes,
  icon = true,
  iconName = 'users',
}: PointTypes) {
  const Image = useImageComponent();
  const stylesTypography = classnames({
    'max-w-[35vw] sm:max-w-[30vw]': isWrapText,
    'max-w-full': isWrapText === false,
  });
  return (
    <div className={classnames('flex items-center gap-8px', styles)} data-tid="point">
      {icon && <Image width={18} height={18} src={`/svg/icons/${iconName}.svg`} alt={iconName} />}
      {!icon && (
        <div
          className={classnames('h-[8px] w-[8px] rounded-circle', circleColor)}
          data-tid="circle"
        />
      )}
      <div className={`${stylesTypography} overflow-hidden`}>
        <Typography type={type} color={textColor} className={`truncate ${classes}`}>
          {text}
        </Typography>
      </div>
    </div>
  );
}

export default Point;
