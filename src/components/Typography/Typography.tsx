import classNames from 'classnames';
import React, { forwardRef, useMemo } from 'react';
import type { VariantTypoTagsStyles, VariantTypoColors, VariantTypoTags } from './types';
import typographyConst from './typography.const';

export interface TypographyTypes {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  tag?: VariantTypoTags;
  type?: VariantTypoTagsStyles;
  color?: VariantTypoColors;
  id?: string;
}

const Typography = forwardRef<HTMLParagraphElement, TypographyTypes>(
  ({ children, text, className, tag = 'p', type = 'BodyL', color = 'text-white_1', id }, ref) => {
    const tagDefault = tag === 'p';
    const Component = useMemo(() => tag, [tag]);
    const classes = useMemo(
      () =>
        classNames({
          [typographyConst.h1]: tag === 'h1',
          [typographyConst.h2]: tag === 'h2',
          [typographyConst.h3]: tag === 'h3',
          [typographyConst.h4]: tag === 'h4',
          [typographyConst.bodyXL]: type === 'BodyXL' && tagDefault,
          [typographyConst.bodyL]: type === 'BodyL' && tagDefault,
          [typographyConst.bodyM]: type === 'BodyM' && tagDefault,
          [typographyConst.bodyS]: type === 'BodyS' && tagDefault,
          [typographyConst.bodyXS]: type === 'BodyXS' && tagDefault,
          [typographyConst.labels]: type === 'Labels' && tagDefault,
          [typographyConst.labelsS]: type === 'LabelsS' && tagDefault,
          [typographyConst.info]: type === 'Info' && tagDefault,
          [typographyConst.infoBold]: type === 'InfoBold' && tagDefault,
          [typographyConst.buttons]: type === 'Buttons' && tagDefault,
          [typographyConst.buttonsSemibold]: type === 'ButtonsSemibold' && tagDefault,
          [typographyConst.buttonsS]: type === 'ButtonsS' && tagDefault,
          [typographyConst.buttonsSBold]: type === 'ButtonsSBold' && tagDefault,
          [typographyConst.buttonsBold]: type === 'ButtonsBold' && tagDefault,
          [typographyConst.m3HeadlineSmall]: type === 'M3HeadlineSmall' && tagDefault,
          [typographyConst.metricsTitle]: type === 'MetricsTitle' && tagDefault,
          [typographyConst.metricsXL]: type === 'MetricsXL' && tagDefault,
          [typographyConst.tabInfoTitle]: type === 'TabInfoTitle' && tagDefault,
          [typographyConst.heroSubtitle]: type === 'HeroSubtitle' && tagDefault,
          [color]: true,
        }),
      [type, tag, tagDefault, color],
    );

    return (
      <Component id={id} ref={ref} className={`${classes} ${className}`}>
        {text}
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
