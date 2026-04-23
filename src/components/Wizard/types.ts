export interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

export interface UseWizardArgs {
  steps: WizardStep[];
  initialStepId?: string;
  onComplete?: () => void;
}

export interface UseWizardReturn {
  steps: WizardStep[];
  currentStep: WizardStep;
  currentIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  back: () => void;
  goTo: (stepId: string) => void;
  canGoTo: (stepId: string) => boolean;
  completedStepIds: string[];
}
