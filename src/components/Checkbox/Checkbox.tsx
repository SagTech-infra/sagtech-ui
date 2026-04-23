'use client';

import { type InputHTMLAttributes, useId } from 'react';
import Typography from '@/components/Typography/Typography';
import CheckboxView from './CheckboxView';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type: 'checkbox';
  label: string;
};

export default function Checkbox({ name, checked, label, onChange, type = 'checkbox' }: Props) {
  const id = useId();
  const inputId = `${id}-${name}`;

  return (
    <label htmlFor={inputId} className="flex items-start gap-8px cursor-pointer">
      <input
        className="hidden"
        id={inputId}
        name={name}
        type={type}
        checked={checked}
        onChange={onChange}
      />
      <div className="flex-shrink-0">
        <CheckboxView checked={checked} />
      </div>
      <Typography type="BodyS" text={label} />
    </label>
  );
}
