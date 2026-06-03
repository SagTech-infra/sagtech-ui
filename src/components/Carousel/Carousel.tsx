"use client";

import {
  Children,
  useCallback,
  useEffect,
  useId,
  useState,
  type Ref,
} from "react";
import classNames from "classnames";
import { useReducedMotion } from "framer-motion";
import { useLocale } from "@/providers/LocaleContext";

export interface CarouselProps {
  children: React.ReactNode;
  slidesToShow?: number;
  gap?: number;
  autoplay?: boolean | number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  index?: number;
  onIndexChange?: (i: number) => void;
  ariaLabel?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_AUTOPLAY_INTERVAL = 4000;

function resolveAutoplayInterval(autoplay: boolean | number): number | null {
  if (autoplay === false) return null;
  if (autoplay === true) return DEFAULT_AUTOPLAY_INTERVAL;
  return autoplay;
}

export default function Carousel({
  children,
  slidesToShow = 1,
  gap = 16,
  autoplay = false,
  loop = false,
  showDots = true,
  showArrows = true,
  index: controlledIndex,
  onIndexChange,
  ariaLabel = "Carousel",
  className,
  ref,
}: CarouselProps) {
  const baseId = useId();
  const { dir } = useLocale();
  const isRtl = dir === "rtl";
  const reduceMotion = useReducedMotion();

  const slides = Children.toArray(children);
  const slideCount = slides.length;
  const perView = Math.max(1, Math.min(slidesToShow, slideCount || 1));
  const maxIndex = Math.max(0, slideCount - perView);
  const pageCount = maxIndex + 1;

  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(0);
  const rawIndex = isControlled ? (controlledIndex as number) : internalIndex;
  const activeIndex = Math.min(Math.max(rawIndex, 0), maxIndex);

  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      let target = next;
      if (loop) {
        if (target > maxIndex) target = 0;
        else if (target < 0) target = maxIndex;
      } else {
        target = Math.min(Math.max(target, 0), maxIndex);
      }
      if (!isControlled) setInternalIndex(target);
      if (target !== activeIndex) onIndexChange?.(target);
    },
    [loop, maxIndex, isControlled, activeIndex, onIndexChange],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  const autoplayInterval = resolveAutoplayInterval(autoplay);
  const atEndNoLoop = !loop && activeIndex >= maxIndex;
  const autoplayEnabled =
    autoplayInterval !== null && !reduceMotion && !paused && pageCount > 1 && !atEndNoLoop;

  useEffect(() => {
    if (!autoplayEnabled) return;
    const id = setInterval(() => {
      goTo(activeIndex + 1);
    }, autoplayInterval as number);
    return () => clearInterval(id);
  }, [autoplayEnabled, autoplayInterval, goTo, activeIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      isRtl ? goNext() : goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      isRtl ? goPrev() : goNext();
    }
  };


  const slideBasis = `calc((100% - ${(perView - 1) * gap}px) / ${perView})`;
  const translateSign = isRtl ? 1 : -1;
  // Each slide occupies (containerWidth + gap) / perView, so translate must account for gap.
  const translateValue = `calc(${translateSign * activeIndex} * (100% + ${gap}px) / ${perView})`;

  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= maxIndex;
  const prevDisabled = !loop && atStart;
  const nextDisabled = !loop && atEnd;

  const arrowClass = classNames(
    "flex items-center justify-center w-[40px] h-[40px] rounded-circle",
    "bg-surface-overlay border border-border-default text-fg-primary",
    "transition-opacity duration-200 cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  );

  return (
    <div
      ref={ref}
      dir={dir}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={classNames(
        "relative outline-none focus-visible:ring-2 focus-visible:ring-pr_purple rounded-16px",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <div
          aria-live={autoplayEnabled ? "off" : "polite"}
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${translateValue})`,
            transition: reduceMotion ? undefined : "transform 300ms ease",
          }}
        >
          {slides.map((child, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}`}
              className="shrink-0 grow-0 snap-start"
              style={{ flexBasis: slideBasis }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && pageCount > 1 && (
        <div className="flex items-center justify-between gap-8px mt-16px">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={prevDisabled}
            onClick={goPrev}
            className={arrowClass}
          >
            <span aria-hidden>{isRtl ? "›" : "‹"}</span>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={nextDisabled}
            onClick={goNext}
            className={arrowClass}
          >
            <span aria-hidden>{isRtl ? "‹" : "›"}</span>
          </button>
        </div>
      )}

      {showDots && pageCount > 1 && (
        <div
          role="tablist"
          aria-label={`${ariaLabel} pagination`}
          className="flex items-center justify-center gap-8px mt-16px"
        >
          {Array.from({ length: pageCount }, (_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => goTo(i)}
                className={classNames(
                  "w-8px h-8px rounded-circle transition-colors duration-200 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
                  isActive ? "bg-pr_purple" : "bg-grey_2",
                )}
              />
            );
          })}
          <span className="sr-only" aria-live="polite" id={`${baseId}-status`}>
            {`Slide ${activeIndex + 1} of ${pageCount}`}
          </span>
        </div>
      )}
    </div>
  );
}
