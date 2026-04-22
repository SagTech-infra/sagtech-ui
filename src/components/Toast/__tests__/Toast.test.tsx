import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Toaster from '../Toaster';
import { toast } from '../toast';
import { toastStore } from '../ToastStore';

afterEach(() => {
  act(() => toastStore.clear());
});

describe('toast() API', () => {
  it('renders a default toast message via the store', () => {
    render(<Toaster />);
    act(() => {
      toast('Saved');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('renders each variant with the proper aria-live level', () => {
    render(<Toaster />);
    act(() => {
      toast.success('ok');
      toast.error('no');
    });
    const statuses = screen.getAllByRole('status');
    expect(statuses[0]).toHaveTextContent('ok');
    expect(statuses[0]).toHaveAttribute('aria-live', 'polite');
    expect(statuses[1]).toHaveTextContent('no');
    expect(statuses[1]).toHaveAttribute('aria-live', 'assertive');
  });

  it('dismisses a toast when the close button is clicked', () => {
    render(<Toaster />);
    act(() => {
      toast('Go away');
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close notification'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('fires the action callback and dismisses the toast', () => {
    const spy = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.success('Deleted', {
        action: { label: 'Undo', onClick: spy },
      });
    });
    fireEvent.click(screen.getByText('Undo'));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the specified duration', async () => {
    render(<Toaster />);
    act(() => {
      toast('Bye', { duration: 80 });
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(
      () => expect(screen.queryByRole('status')).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });

  it('loading variant has Infinity duration and stays on screen', async () => {
    render(<Toaster />);
    act(() => {
      toast.loading('Working');
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.getByText('Working')).toBeInTheDocument();
  });

  it('toast.dismiss(id) removes a specific toast', () => {
    render(<Toaster />);
    let id!: string | number;
    act(() => {
      id = toast('A');
      toast('B');
    });
    expect(screen.getAllByRole('status')).toHaveLength(2);
    act(() => toast.dismiss(id));
    const remaining = screen.getAllByRole('status');
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toHaveTextContent('B');
  });

  it('toast.dismiss() clears everything', () => {
    render(<Toaster />);
    act(() => {
      toast('A');
      toast('B');
      toast('C');
    });
    expect(screen.getAllByRole('status')).toHaveLength(3);
    act(() => toast.dismiss());
    expect(screen.queryAllByRole('status')).toHaveLength(0);
  });

  it('toast.promise transitions loading → success', async () => {
    render(<Toaster />);
    let resolveInner!: (value: { id: number }) => void;
    const pending = new Promise<{ id: number }>((resolve) => {
      resolveInner = resolve;
    });
    act(() => {
      toast.promise(pending, {
        loading: 'Saving…',
        success: (data) => `Saved #${data.id}`,
        error: 'Failed',
      });
    });
    expect(screen.getByText('Saving…')).toBeInTheDocument();
    await act(async () => {
      resolveInner({ id: 7 });
      await pending;
    });
    await waitFor(() => expect(screen.getByText('Saved #7')).toBeInTheDocument());
    expect(screen.queryByText('Saving…')).not.toBeInTheDocument();
  });

  it('toast.promise transitions loading → error', async () => {
    render(<Toaster />);
    let rejectInner!: (reason: Error) => void;
    const pending = new Promise<unknown>((_, reject) => {
      rejectInner = reject;
    });
    act(() => {
      toast.promise(pending, {
        loading: 'Saving…',
        success: 'done',
        error: (err) => `Err: ${(err as Error).message}`,
      });
    });
    await act(async () => {
      rejectInner(new Error('boom'));
      try {
        await pending;
      } catch {
        /* swallow */
      }
    });
    await waitFor(() => expect(screen.getByText('Err: boom')).toBeInTheDocument());
  });

  it('visibleToasts caps the rendered stack', () => {
    render(<Toaster visibleToasts={2} />);
    act(() => {
      toast('1');
      toast('2');
      toast('3');
    });
    const visible = screen.getAllByRole('status');
    expect(visible).toHaveLength(2);
    expect(visible[0]).toHaveTextContent('2');
    expect(visible[1]).toHaveTextContent('3');
  });
});
