import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWizard } from '../useWizard';

const steps = [
  { id: 'a', title: 'A' },
  { id: 'b', title: 'B' },
  { id: 'c', title: 'C' },
];

describe('useWizard', () => {
  it('starts at first step', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    expect(result.current.currentStep.id).toBe('a');
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
    expect(result.current.totalSteps).toBe(3);
  });

  it('honors initialStepId', () => {
    const { result } = renderHook(() => useWizard({ steps, initialStepId: 'b' }));
    expect(result.current.currentStep.id).toBe('b');
  });

  it('next advances and back reverses', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.next());
    expect(result.current.currentStep.id).toBe('b');
    act(() => result.current.back());
    expect(result.current.currentStep.id).toBe('a');
  });

  it('isLast true on final step, next stays there', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.isLast).toBe(true);
    act(() => result.current.next());
    expect(result.current.currentStep.id).toBe('c'); // clamped
  });

  it('goTo only allowed for previously reached steps', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    expect(result.current.canGoTo('b')).toBe(false);
    act(() => result.current.next());
    expect(result.current.canGoTo('a')).toBe(true);
    expect(result.current.canGoTo('b')).toBe(true);
    expect(result.current.canGoTo('c')).toBe(false);
  });

  it('records completed step ids on next', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.next());
    expect(result.current.completedStepIds).toContain('a');
  });
});
