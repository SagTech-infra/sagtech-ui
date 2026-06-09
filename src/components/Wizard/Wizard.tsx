'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import classNames from 'classnames';
import Button from '@/components/Button/Button';
import { useWizard } from './useWizard';
import type { UseWizardReturn, WizardStep } from './types';

const WizardContext = createContext<UseWizardReturn | null>(null);

export function useWizardContext(): UseWizardReturn {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error(
      'Wizard.Progress / Wizard.Content / Wizard.Footer must be rendered inside <Wizard.Root>',
    );
  }
  return ctx;
}

interface RootProps {
  steps: WizardStep[];
  initialStepId?: string;
  onComplete?: () => void;
  className?: string;
  children: ReactNode;
}

function Root({ steps, initialStepId, onComplete, className, children }: RootProps) {
  const wizard = useWizard({ steps, initialStepId, onComplete });
  return (
    <WizardContext.Provider value={wizard}>
      <div className={classNames('flex flex-col gap-24px', className)}>{children}</div>
    </WizardContext.Provider>
  );
}

function Progress({ className }: { className?: string }) {
  const { steps, currentIndex, completedStepIds, canGoTo, goTo } = useWizardContext();
  return (
    <ol
      className={classNames('flex items-center gap-8px', className)}
      aria-label="Wizard progress"
    >
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isCompleted = completedStepIds.includes(step.id);
        const reachable = canGoTo(step.id);
        return (
          <li key={step.id} className="flex-1 flex items-center gap-8px">
            <button
              type="button"
              onClick={() => reachable && goTo(step.id)}
              disabled={!reachable}
              aria-current={isCurrent ? 'step' : undefined}
              className={classNames(
                'flex-1 flex flex-col gap-4px text-left rounded-8px p-8px transition-colors',
                {
                  'cursor-pointer hover:bg-black_2': reachable && !isCurrent,
                  'cursor-not-allowed opacity-60': !reachable,
                },
              )}
            >
              <div className="flex items-center gap-8px">
                <span
                  className={classNames(
                    'w-24px h-24px rounded-[50%] flex items-center justify-center text-12 font-manrope font-bold shrink-0',
                    {
                      'bg-pr_purple text-white': isCurrent,
                      'bg-success text-white': isCompleted && !isCurrent,
                      'bg-black_3 text-grey_2': !isCurrent && !isCompleted,
                    },
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M2 6l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={classNames('text-14 font-manrope font-semibold truncate', {
                    'text-white_4': isCurrent,
                    'text-grey_4': !isCurrent,
                  })}
                >
                  {step.title}
                </span>
              </div>
              {step.description && (
                <span className="text-12 text-grey_2 font-manrope pl-32px truncate hidden sm:inline">
                  {step.description}
                </span>
              )}
            </button>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={classNames('h-px w-[16px] shrink-0', {
                  'bg-pr_purple': index < currentIndex,
                  'bg-black_3': index >= currentIndex,
                })}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface ContentProps {
  children: ReactNode | ((ctx: UseWizardReturn) => ReactNode);
  className?: string;
}

function Content({ children, className }: ContentProps) {
  const ctx = useWizardContext();
  return (
    <div className={classNames('flex flex-col', className)}>
      {typeof children === 'function' ? children(ctx) : children}
    </div>
  );
}

interface FooterProps {
  backText?: string;
  nextText?: string;
  finishText?: string;
  onNext?: () => boolean | void | Promise<boolean | void>;
  onBack?: () => void;
  onFinish?: () => void;
  isNextLoading?: boolean;
  isNextDisabled?: boolean;
  className?: string;
}

function Footer({
  backText = 'Back',
  nextText = 'Continue',
  finishText = 'Finish',
  onNext,
  onBack,
  onFinish,
  isNextLoading,
  isNextDisabled,
  className,
}: FooterProps) {
  const { isFirst, isLast, next, back } = useWizardContext();

  const handleBack = useCallback(() => {
    onBack?.();
    back();
  }, [onBack, back]);

  const handleNext = useCallback(async () => {
    if (onNext) {
      const result = await onNext();
      if (result === false) return;
    }
    if (isLast) {
      onFinish?.();
    }
    next();
  }, [onNext, onFinish, isLast, next]);

  return (
    <div className={classNames('flex items-center justify-between gap-8px', className)}>
      <Button
        text={backText}
        variant="secondary"
        buttonSize="small"
        disabled={isFirst}
        onClick={handleBack}
      />
      <Button
        text={isLast ? finishText : nextText}
        variant="primary"
        buttonSize="small"
        loadingType={isNextLoading}
        disabled={isNextDisabled || isNextLoading}
        onClick={handleNext}
      />
    </div>
  );
}

export const Wizard = {
  Root,
  Progress,
  Content,
  Footer,
};

export { useWizardContext as useWizardInternal };
