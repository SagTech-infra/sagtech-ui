import React, { type InputHTMLAttributes, type DetailedHTMLProps, useId } from 'react';
import type { SVGProps } from 'react';

function SearchIcon({ color = 'inherit', ...rest }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color || 'none'}
      {...rest}
    >
      <path
        d="M18.031 16.617L22.314 20.899L20.899 22.314L16.617 18.031C15.0237 19.3082 13.042 20.0029 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20.0029 13.042 19.3082 15.0237 18.031 16.617ZM16.025 15.875C17.2941 14.5699 18.0029 12.8204 18 11C18 7.132 14.867 4 11 4C7.132 4 4 7.132 4 11C4 14.867 7.132 18 11 18C12.8204 18.0029 14.5699 17.2941 15.875 16.025L16.025 15.875Z"
        fill="#B5B5B9"
      />
    </svg>
  );
}

interface InputTypes
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search within SagTech Blogs',
  ...rest
}: InputTypes & {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = useId();
  const inputProps = value !== undefined ? { value, onChange } : { defaultValue: '', onChange };

  return (
    <label
      htmlFor={id}
      className="bg-black_1 border-[1px] border-solid rounded-[5em] flex w-full min-w-[320px] max-w-[650px] px-24px py-12px border-pr_purple items-center gap-12px"
    >
      <input
        id={id}
        placeholder={placeholder}
        autoComplete="off"
        className="bg-transparent font-medium w-full text-16 leading-24 outline-none placeholder:text-grey_2 text-white_4 caret-pr_purple"
        {...inputProps}
        {...rest}
      />
      <SearchIcon className="shrink-0" />
    </label>
  );
}
