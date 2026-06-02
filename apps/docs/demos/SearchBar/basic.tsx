'use client';
import { useState } from 'react';
import { SearchBar } from '@sagtech-infra/ui';

export default function Demo() {
  const [value, setValue] = useState('');
  return (
    <div className="w-full max-w-[480px]">
      <SearchBar
        placeholder="Search within SagTech Blogs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
