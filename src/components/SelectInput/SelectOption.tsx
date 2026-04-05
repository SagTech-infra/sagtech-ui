'use client';

import { memo } from 'react';
import CheckboxView from '@/components/Checkbox/CheckboxView';
import Typography from '@/components/Typography/Typography';
import type { SelectOption } from './types';

type Props = {
  option: SelectOption<string>;
  onSelect: (value: string) => void;
  isActive?: boolean;
  withChecbox?: boolean;
};

function SelectOptionItem({ onSelect, isActive = false, withChecbox = false, option }: Props) {
  const { value, label } = option;

  return (
    <li className="border-black_2 border-b-1 last:border-[0px] border-solid border-1px">
      <button
        type="button"
        onClick={() => onSelect(value)}
        className="w-full flex justify-between items-center cursor-pointer transition-[background] py-8px px-[4px]"
      >
        <Typography
          type="Labels"
          color="text-white"
          className="!font-normal truncate w-[80%] text-left"
        >
          {label}
        </Typography>
        {withChecbox && <CheckboxView checked={isActive} />}
      </button>
    </li>
  );
}

export default memo(SelectOptionItem);
