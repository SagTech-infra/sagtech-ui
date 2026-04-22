import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormHint,
  FormError,
} from '../Form';

interface Values {
  name: string;
  email: string;
}

function Harness({
  defaultValues = { name: '', email: '' },
  onSubmit = () => {},
}: {
  defaultValues?: Values;
  onSubmit?: (v: Values) => void;
}) {
  const methods = useForm<Values>({ defaultValues });
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          control={methods.control}
          name="name"
          rules={{ required: 'Name required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input {...field} data-testid="name-input" />
              </FormControl>
              <FormHint>Your full name</FormHint>
              <FormError />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="email"
          rules={{
            required: 'Email required',
            pattern: { value: /@/, message: 'Invalid email' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input {...field} data-testid="email-input" />
              </FormControl>
              <FormError />
            </FormItem>
          )}
        />
        <button type="submit">submit</button>
      </form>
    </Form>
  );
}

describe('Form system', () => {
  it('renders labels wired to each input by id', () => {
    render(<Harness />);
    const nameInput = screen.getByTestId('name-input');
    const nameLabel = screen.getByText('Name');
    expect(nameLabel.tagName).toBe('LABEL');
    expect(nameLabel).toHaveAttribute('for', nameInput.id);
  });

  it('links the hint via aria-describedby on the input', () => {
    render(<Harness />);
    const nameInput = screen.getByTestId('name-input');
    const hint = screen.getByText('Your full name');
    expect(nameInput).toHaveAttribute('aria-describedby', hint.id);
  });

  it('surfaces validation errors after a failed submit', async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('submit'));
    await waitFor(() => expect(screen.getByText('Name required')).toBeInTheDocument());
    expect(screen.getByText('Email required')).toBeInTheDocument();
    const nameInput = screen.getByTestId('name-input');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears the error and aria-invalid once the field becomes valid', async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('submit'));
    await waitFor(() => expect(screen.getByText('Name required')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Ada' } });
    await waitFor(() => expect(screen.queryByText('Name required')).not.toBeInTheDocument());
    const nameInput = screen.getByTestId('name-input');
    expect(nameInput).not.toHaveAttribute('aria-invalid');
  });

  it('submits the collected values', async () => {
    const spy = vi.fn();
    render(<Harness onSubmit={spy} />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'a@b' } });
    fireEvent.click(screen.getByText('submit'));
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ada', email: 'a@b' }),
        expect.anything(),
      ),
    );
  });

  it('Slot merges className from wrapper and child', async () => {
    function WrapperProbe() {
      const methods = useForm<Values>({ defaultValues: { name: '', email: '' } });
      return (
        <Form {...methods}>
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input {...field} className="child-class" data-testid="probe" />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<WrapperProbe />);
    const input = screen.getByTestId('probe');
    expect(input).toHaveClass('child-class');
    expect(input.id).not.toBe('');
  });
});

