'use client';
import { useState } from 'react';
import { InlineEdit } from '@sagtech-infra/ui';

export default function Demo() {
  const [name, setName] = useState('Ada Lovelace');
  return (
    <div className="w-full max-w-[320px]">
      <InlineEdit
        value={name}
        onSave={(next) => setName(next)}
        placeholder="Enter your name"
      />
    </div>
  );
}
