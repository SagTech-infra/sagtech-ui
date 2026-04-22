'use client';

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentProps,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';
import classNames from 'classnames';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Slot } from './Slot';

export const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

interface FormItemContextValue {
  id: string;
}

const FormItemContext = createContext<FormItemContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const value = useMemo<FormFieldContextValue<TFieldValues, TName>>(
    () => ({ name: props.name }),
    [props.name],
  );
  return (
    <FormFieldContext.Provider value={value as FormFieldContextValue}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const formContext = useFormContext();

  if (!fieldContext || !itemContext || !formContext) {
    throw new Error(
      'useFormField() must be used inside <Form><FormField><FormItem>…</FormItem></FormField></Form>.',
    );
  }

  const formState = useFormState({ name: fieldContext.name });
  const fieldState = formContext.getFieldState(fieldContext.name, formState);

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-item`,
    formHintId: `${itemContext.id}-hint`,
    formErrorId: `${itemContext.id}-error`,
    ...fieldState,
  };
}

export function FormItem({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const id = useId();
  const value = useMemo(() => ({ id }), [id]);
  return (
    <FormItemContext.Provider value={value}>
      <div
        data-slot="form-item"
        className={classNames('flex flex-col gap-6px', className)}
        {...rest}
      />
    </FormItemContext.Provider>
  );
}

export function FormLabel({
  className,
  children,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  const { error, formItemId } = useFormField();
  return (
    <label
      htmlFor={formItemId}
      data-error={Boolean(error) || undefined}
      className={classNames(
        'text-12 font-bold leading-18 text-white_4 data-[error=true]:text-error',
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}

export function FormControl(props: ComponentProps<typeof Slot>) {
  const { error, formItemId, formHintId, formErrorId } = useFormField();
  return (
    <Slot
      id={formItemId}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={error ? `${formHintId} ${formErrorId}` : formHintId}
      {...props}
    />
  );
}

export function FormHint({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  const { formHintId } = useFormField();
  if (!children) return null;
  return (
    <p
      id={formHintId}
      className={classNames('text-12 text-grey_4 leading-16', className)}
      {...rest}
    >
      {children}
    </p>
  );
}

export function FormError({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  const { error, formErrorId } = useFormField();
  const message: ReactNode = children ?? (error?.message as ReactNode | undefined);
  if (!message) return null;
  return (
    <p
      id={formErrorId}
      role="alert"
      className={classNames('text-12 text-error font-medium leading-16', className)}
      {...rest}
    >
      {message}
    </p>
  );
}
