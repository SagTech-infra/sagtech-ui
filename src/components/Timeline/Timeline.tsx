'use client';

/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import settings from './swiper-settings';
import defaultStyles from './styles';
import Typography from '@/components/Typography/Typography';
import SliderArrow from '@/components/SliderArrow/SliderArrow';

interface Text {
  title: string;
  text: string;
}

interface TimeLineProps {
  data?: Text[];
  imgName?: string[];
  classes?: string;
  children?: React.ReactNode;
  isInView?: boolean;
  onSlideChange?: (currentSlide: number) => void;
  /** Number of slides visible at once. Undefined = default scroll behavior (1 slide width). */
  visibleSlides?: number;
}

export function Timeline({
  data,
  imgName,
  classes,
  children,
  isInView,
  onSlideChange,
  visibleSlides,
}: TimeLineProps) {
  const [dragStartX, setDragStartX] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isFixed = visibleSlides !== undefined;

  const sliderRef = useRef<SwiperRef>(null);

  const handleSlideChange = (slide: number) => {
    if (onSlideChange) {
      onSlideChange(slide);
      setCurrentSlide(slide);
    }
  };

  const handleNext = useCallback(() => {
    sliderRef?.current?.swiper.slideNext();
  }, []);

  const handlePrev = useCallback(() => {
    sliderRef?.current?.swiper.slidePrev();
  }, []);

  const handleDragStart = (event: React.DragEvent) => {
    setDragStartX(event.clientX);
  };
  const handleTouchStart = (event: React.TouchEvent) => {
    const { clientX } = event.touches[0];
    setTouchStartX(clientX);
  };

  const handleDragEnd = (event: React.DragEvent) => {
    const dragEndX = event.clientX;
    const deltaX = dragEndX - dragStartX;

    if (deltaX > 0) {
      handlePrev();
    } else if (deltaX < 0) {
      handleNext();
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const { clientX } = event.changedTouches[0];
    const deltaTouchX = clientX - touchStartX;

    if (deltaTouchX > 0) {
      handlePrev();
    } else if (deltaTouchX < 0) {
      handleNext();
    }
  };

  useEffect(() => {
    const swiper = sliderRef?.current?.swiper;
    if (!swiper?.autoplay) return;
    if (isInView) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  }, [isInView]);

  const images = useMemo(() => {
    if (!children) return null;

    return React.Children.map(children, (child, index) => (
      <div
        className={`${defaultStyles.coverImg}
         ${imgName && index === imgName.length - 1 ? 'relative' : ''}
          ${classes !== undefined ? classes : ''} ${currentSlide === index ? 'z-[10]' : 'z-[5]'}`}
      >
        {React.cloneElement(child as React.ReactElement<any>, {
          className: `${defaultStyles.img}`,
        })}
      </div>
    ));
  }, [classes, imgName, currentSlide, children]);

  const information = useMemo(() => {
    if (data !== undefined) {
      return data.map((text, id) => (
        <SwiperSlide key={text.title}>
          <div>
            <div className="relative">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-50% bg-pr_purple">
                <span className="text-16 font-bold leading-28 text-white">{id + 1}</span>
              </div>
            </div>
            <div className="mt-16px flex flex-col gap-8px">
              <Typography tag="h3" color="text-white_4">
                {text.title}
              </Typography>
              <Typography type="BodyM" color="text-grey_4">
                {text.text}
              </Typography>
            </div>
          </div>
        </SwiperSlide>
      ));
    }

    return null;
  }, [data]);

  const swiperProps = isFixed
    ? { slidesPerView: visibleSlides, spaceBetween: 32, loop: false }
    : settings;

  const showArrows = !isFixed || (data && visibleSlides && visibleSlides < data.length);

  return (
    <div className="relative w-full">
      <div
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mr-16px sm:mr-32px 2xl:mr-72px"
      >
        {images}
      </div>
      {showArrows && (
        <div className="flex gap-16px justify-end mt-24px mb-16px">
          <SliderArrow onClick={handlePrev} />
          <SliderArrow onClick={handleNext} isReversed />
        </div>
      )}
      <div className={`relative ${!isFixed ? '-mr-8px 2xl:-mr-48px' : ''}`}>
        <div className="absolute left-[2px] top-[10px] w-full border-5 border-solid border-pr_purple" />
        <Swiper
          ref={sliderRef}
          autoplay={!isFixed ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          modules={!isFixed ? [Autoplay] : []}
          speed={800}
          className={!isFixed ? 'timeline-swiper swiper-time-line' : ''}
          {...swiperProps}
          onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
        >
          {information}
        </Swiper>
      </div>
    </div>
  );
}

export default Timeline;
