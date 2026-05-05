'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import type { SpotlightPlacement, SpotlightProps, SpotlightRect } from './types';

const TOOLTIP_GAP = 12;
const TOOLTIP_WIDTH = 320;

function computePlacement(
  rect: SpotlightRect,
  preferred: SpotlightPlacement,
  viewportW: number,
  viewportH: number,
): Exclude<SpotlightPlacement, 'auto'> {
  if (preferred !== 'auto') return preferred;
  const spaceBelow = viewportH - (rect.top + rect.height);
  const spaceAbove = rect.top;
  const spaceRight = viewportW - (rect.left + rect.width);
  const spaceLeft = rect.left;
  const spaces: Array<[Exclude<SpotlightPlacement, 'auto'>, number]> = [
    ['bottom', spaceBelow],
    ['top', spaceAbove],
    ['right', spaceRight],
    ['left', spaceLeft],
  ];
  spaces.sort((a, b) => b[1] - a[1]);
  return spaces[0][0];
}

function tooltipPosition(
  rect: SpotlightRect,
  placement: Exclude<SpotlightPlacement, 'auto'>,
  viewportW: number,
  viewportH: number,
): { top: number; left: number } {
  let top = 0;
  let left = 0;
  switch (placement) {
    case 'top':
      top = rect.top - TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      // we'll translateY(-100%) via CSS via top placement marker
      break;
    case 'bottom':
      top = rect.top + rect.height + TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2;
      left = rect.left - TOOLTIP_GAP - TOOLTIP_WIDTH;
      break;
    case 'right':
      top = rect.top + rect.height / 2;
      left = rect.left + rect.width + TOOLTIP_GAP;
      break;
  }
  // clamp horizontally (top/bottom)
  if (placement === 'top' || placement === 'bottom') {
    left = Math.max(16, Math.min(viewportW - TOOLTIP_WIDTH - 16, left));
  }
  // clamp vertically (top/bottom)
  if (placement === 'top') {
    top = Math.max(16, top);
  }
  if (placement === 'bottom') {
    top = Math.min(viewportH - 16, top);
  }
  return { top, left };
}

export function Spotlight({
  targetRef,
  open,
  onOpenChange,
  title,
  description,
  step,
  totalSteps,
  onNext,
  onSkip,
  placement = 'auto',
  cutoutPadding = 8,
  cutoutRadius = 8,
  className,
}: SpotlightProps) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: typeof window === 'undefined' ? 0 : window.innerWidth,
    h: typeof window === 'undefined' ? 0 : window.innerHeight,
  });

  const skip = useCallback(() => {
    if (onSkip) onSkip();
    else onOpenChange(false);
  }, [onSkip, onOpenChange]);

  const updateRect = useCallback(() => {
    const el = targetRef.current;
    if (!el || typeof window === 'undefined') return;
    const r = el.getBoundingClientRect();
    setRect({
      top: r.top - cutoutPadding,
      left: r.left - cutoutPadding,
      width: r.width + cutoutPadding * 2,
      height: r.height + cutoutPadding * 2,
    });
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, [targetRef, cutoutPadding]);

  useEffect(() => {
    if (!open) return;
    updateRect();
    const handleResize = () => updateRect();
    const handleScroll = () => updateRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && targetRef.current) {
      observer = new ResizeObserver(updateRect);
      observer.observe(targetRef.current);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      observer?.disconnect();
    };
  }, [open, updateRect, targetRef]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        skip();
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, skip]);

  if (typeof document === 'undefined') return null;

  if (!open || !rect) {
    return open
      ? createPortal(
          <div
            className="fixed inset-0 bg-backdrop"
            style={{ zIndex: 'var(--z-modal)' }}
          />,
          document.body,
        )
      : null;
  }

  const resolvedPlacement = computePlacement(rect, placement, viewport.w, viewport.h);
  const tipPos = tooltipPosition(rect, resolvedPlacement, viewport.w, viewport.h);

  // Build SVG mask: full-screen black with a transparent rounded rect for the cutout.
  const maskId = 'sagtech-spotlight-mask';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={classNames('fixed inset-0', className)}
          style={{ zIndex: 'var(--z-modal)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${viewport.w} ${viewport.h}`}
            preserveAspectRatio="none"
            className="fixed inset-0 w-full h-full pointer-events-auto"
            onClick={skip}
          >
            <defs>
              <mask id={maskId}>
                <rect x="0" y="0" width={viewport.w} height={viewport.h} fill="white" />
                <rect
                  x={rect.left}
                  y={rect.top}
                  width={rect.width}
                  height={rect.height}
                  rx={cutoutRadius}
                  ry={cutoutRadius}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width={viewport.w}
              height={viewport.h}
              fill="rgba(0, 0, 0, 0.72)"
              mask={`url(#${maskId})`}
            />
          </svg>

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'sagtech-spotlight-title' : undefined}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, delay: 0.05 }}
            style={{
              position: 'fixed',
              top: tipPos.top,
              left: tipPos.left,
              width: TOOLTIP_WIDTH,
              transform:
                resolvedPlacement === 'top'
                  ? 'translateY(-100%)'
                  : resolvedPlacement === 'left' || resolvedPlacement === 'right'
                  ? 'translateY(-50%)'
                  : undefined,
            }}
            className="rounded-16px bg-black_2 border border-black_3 p-20px shadow-6xl pointer-events-auto"
          >
            {(step || totalSteps) && (
              <div className="text-12 text-grey_2 font-manrope mb-8px">
                {step ?? '?'}
                {totalSteps ? ` / ${totalSteps}` : ''}
              </div>
            )}
            {title && (
              <h3
                id="sagtech-spotlight-title"
                className="font-manrope text-16 font-semibold text-white_4 mb-8px break-words"
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="font-manrope text-14 text-grey_4 leading-18 break-words">
                {description}
              </p>
            )}
            <div className="mt-16px flex items-center justify-end gap-8px">
              <button
                type="button"
                onClick={skip}
                className="px-12px py-6px rounded-8px text-12 text-grey_4 hover:text-white_4 cursor-pointer font-manrope"
              >
                Skip
              </button>
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-16px py-6px rounded-8px bg-pr_purple hover:bg-sec_purple text-12 text-white_4 cursor-pointer font-manrope font-semibold"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default Spotlight;
