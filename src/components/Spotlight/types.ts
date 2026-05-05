import type { RefObject } from 'react';

export type SpotlightPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface SpotlightProps {
  /** Ref to the element to highlight. */
  targetRef: RefObject<HTMLElement | null>;
  /** Whether the spotlight is visible. */
  open: boolean;
  /** Called when the user dismisses (Esc, backdrop click, skip button). */
  onOpenChange: (open: boolean) => void;
  /** Optional title displayed in the tooltip card. */
  title?: React.ReactNode;
  /** Optional descriptive body. */
  description?: React.ReactNode;
  /** Step index for multi-step tours (1-based). */
  step?: number;
  /** Total number of steps for multi-step tours. */
  totalSteps?: number;
  /** Called when the user clicks "Next". When provided, shows a Next button. */
  onNext?: () => void;
  /** Called when the user clicks "Skip" / closes. Falls back to onOpenChange(false). */
  onSkip?: () => void;
  /** Where the tooltip card should appear relative to target. */
  placement?: SpotlightPlacement;
  /** Padding around the cutout in pixels. Default 8. */
  cutoutPadding?: number;
  /** Border radius of the cutout in pixels. Default 8. */
  cutoutRadius?: number;
  className?: string;
}

export interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
