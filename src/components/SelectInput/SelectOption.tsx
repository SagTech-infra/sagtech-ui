'use client';

import { memo } from 'react';
import CheckboxView from '@/components/Checkbox/CheckboxView';
import Typography from '@/components/Typography/Typography';
import type { SelectOption } from './types';

type Props = {
  option: SelectOption<string>;
  onSelect: (value: string) => void;
  isActive?: boolean;
  isHighlighted?: boolean;
  withChecbox?: boolean;
};

function SelectOptionItem({
  onSelect,
  isActive = false,
  isHighlighted = false,
  withChecbox = false,
  option,
}: Props) {
  const { value, label } = option;

  return (
    <li
      role="option"
      aria-selected={isActive || undefined}
      className={`border-black_2 border-b-1 last:border-0 border-solid border-1px ${
        isHighlighted ? 'bg-pr_purple/10' : ''
      }`}
    >
      <button
        type="button"
        tabIndex={-1}
        onClick={() => onSelect(value)}
        className="w-full flex justify-between items-center cursor-pointer transition-[background] py-8px px-4px"
      >
        <Typography
          type="Labels"
          color="text-white"
          className="font-normal! truncate w-[80%] text-left"
        >
          {label}
        </Typography>
        {withChecbox && <CheckboxView checked={isActive} />}
      </button>
    </li>
  );
}

export default memo(SelectOptionItem);
