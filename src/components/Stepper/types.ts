export type StepperStatus = 'pending' | 'active' | 'complete' | 'error';

export interface StepperStep {
  /** Title shown next to the indicator. */
  label: string;
  /** Optional secondary description. */
  description?: string;
  /** Visual status. */
  status: StepperStatus;
}

export type StepperOrientation = 'horizontal' | 'vertical';

export type StepperClickable = 'all' | 'completed' | 'none';
