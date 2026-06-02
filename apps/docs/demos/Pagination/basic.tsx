'use client';
import { useState } from 'react';
import { Pagination } from '@sagtech-infra/ui';

export default function Demo() {
  const [page, setPage] = useState(1);

  return (
    <div className="bg-black_1 p-24px rounded-16px">
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
    </div>
  );
}
