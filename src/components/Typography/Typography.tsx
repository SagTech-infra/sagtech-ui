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
  htmlFor?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Typography = forwardRef<HTMLElement, TypographyTypes>(
  (
    {
      children,
      text,
      className,
      tag = 'p',
      type = 'BodyL',
      color = 'text-white_1',
      id,
      htmlFor,
      onClick,
    },
    ref,
  ) => {
    const tagDefault = tag !== 'h1' && tag !== 'h2' && tag !== 'h3' && tag !== 'h4';
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
          [typographyConst.displayXL]: type === 'DisplayXL' && tagDefault,
          [typographyConst.displayL]: type === 'DisplayL' && tagDefault,
          [typographyConst.sectionTitleL]: type === 'SectionTitleL' && tagDefault,
          [typographyConst.sectionTitleM]: type === 'SectionTitleM' && tagDefault,
          [typographyConst.sectionTitleS]: type === 'SectionTitleS' && tagDefault,
          [color]: true,
        }),
      [type, tag, tagDefault, color],
    );

    return (
      <Component
        id={id}
        ref={ref as never}
        className={`${classes} ${className ?? ''}`}
        onClick={onClick}
        {...(tag === 'label' && htmlFor ? { htmlFor } : {})}
      >
        {text}
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
