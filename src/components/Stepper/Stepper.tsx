'use client';

import classNames from 'classnames';
import type {
  StepperClickable,
  StepperOrientation,
  StepperStatus,
  StepperStep,
} from './types';

export interface StepperProps {
  steps: StepperStep[];
  orientation?: StepperOrientation;
  /** Called with the index of the clicked step (when clickable). */
  onStepClick?: (index: number) => void;
  /** Which steps respond to clicks. */
  clickableSteps?: StepperClickable;
  className?: string;
}

const indicatorBaseClasses =
  'flex-shrink-0 inline-flex items-center justify-center w-[28px] h-[28px] rounded-full font-manrope text-12 font-semibold border-2 transition-colors duration-150 select-none';

const statusClasses: Record<StepperStatus, string> = {
  pending: 'bg-black_2 border-black_3 text-fg-muted',
  active: 'bg-pr_purple border-pr_purple text-white',
  complete: 'bg-pr_purple border-pr_purple text-white',
  error: 'bg-error border-error text-white',
};

const labelStatusClasses: Record<StepperStatus, string> = {
  pending: 'text-fg-muted',
  active: 'text-fg-primary',
  complete: 'text-fg-primary',
  error: 'text-error',
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.5L8.5 14L15 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6 6l8 8M14 6l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function isClickable(status: StepperStatus, clickableSteps: StepperClickable): boolean {
  if (clickableSteps === 'none') return false;
  if (clickableSteps === 'all') return true;
  return status === 'complete';
}

function StepIndicatorContent({
  status,
  index,
}: {
  status: StepperStatus;
  index: number;
}) {
  if (status === 'complete') return <CheckIcon />;
  if (status === 'error') return <ErrorIcon />;
  return <span>{index + 1}</span>;
}

export function Stepper({
  steps,
  orientation = 'horizontal',
  onStepClick,
  clickableSteps = 'completed',
  className,
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <ol
      role="list"
      aria-orientation={orientation}
      className={classNames(
        'flex font-manrope',
        isVertical ? 'flex-col' : 'flex-row items-start w-full',
        className,
      )}
    >
      {steps.map((step, index) => {
        const clickable = isClickable(step.status, clickableSteps) && !!onStepClick;
        const isLast = index === steps.length - 1;
        const connectorActive =
          step.status === 'complete' || step.status === 'active';

        const indicator = clickable ? (
          <button
            type="button"
            onClick={() => onStepClick?.(index)}
            aria-label={`Go to step ${index + 1}: ${step.label}`}
            aria-current={step.status === 'active' ? 'step' : undefined}
            className={classNames(
              indicatorBaseClasses,
              statusClasses[step.status],
              'cursor-pointer hover:opacity-90',
            )}
          >
            <StepIndicatorContent status={step.status} index={index} />
          </button>
        ) : (
          <div
            aria-current={step.status === 'active' ? 'step' : undefined}
            className={classNames(indicatorBaseClasses, statusClasses[step.status])}
          >
            <StepIndicatorContent status={step.status} index={index} />
          </div>
        );

        const labelBlock = (
          <div className="min-w-0">
            <div
              className={classNames(
                'text-14 font-semibold leading-18 break-words',
                labelStatusClasses[step.status],
              )}
            >
              {step.label}
            </div>
            {step.description && (
              <div className="text-12 text-fg-muted mt-2px leading-16 break-words">
                {step.description}
              </div>
            )}
          </div>
        );

        if (isVertical) {
          return (
            <li key={`${step.label}-${index}`} className="flex flex-row items-stretch">
              <div className="flex flex-col items-center mr-12px">
                {indicator}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={classNames(
                      'w-[2px] flex-1 my-4px min-h-[24px]',
                      connectorActive ? 'bg-pr_purple' : 'bg-black_3',
                    )}
                  />
                )}
              </div>
              <div className={classNames('pt-2px flex-1', !isLast && 'pb-24px')}>
                {labelBlock}
              </div>
            </li>
          );
        }

        // horizontal
        return (
          <li
            key={`${step.label}-${index}`}
            className={classNames('flex flex-col items-start', !isLast && 'flex-1 min-w-0')}
          >
            <div
              className={classNames(
                'flex flex-row items-center',
                !isLast && 'w-full',
              )}
            >
              {indicator}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={classNames(
                    'h-[2px] flex-1 mx-8px',
                    connectorActive ? 'bg-pr_purple' : 'bg-black_3',
                  )}
                />
              )}
            </div>
            <div className="mt-8px max-w-[160px]">{labelBlock}</div>
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
