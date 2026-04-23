'use client';

import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useLinkComponent } from '@/providers';
import cardWrapperConst from './cardwrapper.const';
import type { VariantTypoRounded, VariantTypoStoke } from './types';

interface CardWrapperTypes {
  className?: string;
  children?: React.ReactNode;
  rounded?: VariantTypoRounded;
  stoke?: VariantTypoStoke;
  href?: string;
  hrefClickEvent?: () => void;
}

function CardWrapper({ className, children, rounded = '24', stoke = '2', href, hrefClickEvent }: CardWrapperTypes) {
  const Link = useLinkComponent();
  const stoke1 = stoke === '1';
  const stoke2 = stoke === '2';
  const rounded0 = rounded === '0';
  const rounded8 = rounded === '8';
  const rounded24 = rounded === '24';
  const rounded40 = rounded === '40';
  const rounded16 = rounded === '16';
  const rounded12 = rounded === '12';
  const rounded100 = rounded === '100';

  const classes = useMemo(
    () =>
      classNames({
        [cardWrapperConst.stoke1Border24]: stoke1 && rounded24,
        [cardWrapperConst.stoke2Border24]: stoke2 && rounded24,
        [cardWrapperConst.stoke1Border40]: stoke1 && rounded40,
        [cardWrapperConst.stoke2Border40]: stoke2 && rounded40,
        [cardWrapperConst.stoke2Border16]: stoke2 && rounded16,
        [cardWrapperConst.stoke2Border12]: stoke2 && rounded12,
        [cardWrapperConst.stoke1Border100]: stoke1 && rounded100,
        [cardWrapperConst.stoke2Border8]: stoke2 && rounded8,
        [cardWrapperConst.stroke1Border0]: stoke1 && rounded0,
      }),
    [stoke1, rounded24, stoke2, rounded40, rounded16, rounded12, rounded100, rounded8, rounded0],
  );

  const classNameCommon = classNames(
    'card_wrapper w-full justify-between overflow-hidden',
    classes,
    className,
  );

  const linkClassName = classNames(
    classNameCommon,
    'block cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-3xl hover:brightness-110',
  );

  return href ? (
    <Link href={href} className={linkClassName} onClick={hrefClickEvent}>
      {children}
    </Link>
  ) : (
    <div className={classNameCommon} data-tid="card-wrapper">
      {children}
    </div>
  );
}

export default CardWrapper;
