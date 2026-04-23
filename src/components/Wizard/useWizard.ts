'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { UseWizardArgs, UseWizardReturn } from './types';

export function useWizard({
  steps,
  initialStepId,
  onComplete,
}: UseWizardArgs): UseWizardReturn {
  if (steps.length === 0) {
    throw new Error('useWizard: `steps` must contain at least one step.');
  }

  const initialIndex = useMemo(() => {
    if (!initialStepId) return 0;
    const idx = steps.findIndex((step) => step.id === initialStepId);
    return idx === -1 ? 0 : idx;
  }, [steps, initialStepId]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const highestReachedIndexRef = useRef(initialIndex);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  const advanceReachedIndex = useCallback((index: number) => {
    if (index > highestReachedIndexRef.current) {
      highestReachedIndexRef.current = index;
    }
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const isOnLast = prev === steps.length - 1;
      if (isOnLast) {
        setCompletedStepIds((ids) =>
          ids.includes(steps[prev].id) ? ids : [...ids, steps[prev].id],
        );
        onComplete?.();
        return prev;
      }
      setCompletedStepIds((ids) =>
        ids.includes(steps[prev].id) ? ids : [...ids, steps[prev].id],
      );
      const nextIndex = prev + 1;
      advanceReachedIndex(nextIndex);
      return nextIndex;
    });
  }, [steps, advanceReachedIndex, onComplete]);

  const back = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const canGoTo = useCallback(
    (stepId: string) => {
      const idx = steps.findIndex((step) => step.id === stepId);
      if (idx === -1) return false;
      return idx <= highestReachedIndexRef.current;
    },
    [steps],
  );

  const goTo = useCallback(
    (stepId: string) => {
      const idx = steps.findIndex((step) => step.id === stepId);
      if (idx === -1 || idx > highestReachedIndexRef.current) return;
      setCurrentIndex(idx);
    },
    [steps],
  );

  return {
    steps,
    currentStep: steps[currentIndex],
    currentIndex,
    totalSteps: steps.length,
    isFirst: currentIndex === 0,
    isLast: currentIndex === steps.length - 1,
    next,
    back,
    goTo,
    canGoTo,
    completedStepIds,
  };
}
