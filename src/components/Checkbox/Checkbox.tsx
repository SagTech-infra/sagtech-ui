"use client";

import { type ChangeEvent, type InputHTMLAttributes, useId } from "react";
import Typography from "@/components/Typography/Typography";
import CheckboxView from "./CheckboxView";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  type: "checkbox";
  label: string;
  onCheckedChange?: (checked: boolean) => void;
};

export default function Checkbox({
  name,
  checked,
  label,
  onChange,
  onCheckedChange,
  type = "checkbox",
  ...rest
}: Props) {
  const id = useId();
  const inputId = `${id}-${name}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  };

  return (
    <label
      htmlFor={inputId}
      className="flex items-start gap-8px cursor-pointer"
    >
      <input
        className="hidden"
        id={inputId}
        name={name}
        type={type}
        checked={checked}
        onChange={handleChange}
        {...rest}
      />
      <div className="flex-shrink-0">
        <CheckboxView checked={checked} />
      </div>
      <Typography type="BodyS" text={label} />
    </label>
  );
}
