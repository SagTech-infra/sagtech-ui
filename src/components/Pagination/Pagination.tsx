'use client';

import { useMemo } from 'react';
import classNames from 'classnames';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const totalSlots = siblingCount * 2 + 5; // siblings + current + 2 boundaries + 2 ellipses

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = siblingCount * 2 + 3;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblingCount * 2 + 3;
    const rightRange = Array.from({ length: rightCount }, (_, i) => totalPages - rightCount + 1 + i);
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

function ChevronLeft() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const pages = useMemo(
    () => generatePageRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav className={classNames('flex items-center gap-4px', className)} aria-label="Pagination">
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={classNames(
          'w-[36px] h-[36px] rounded-8px flex items-center justify-center transition-colors',
          {
            'text-grey_4 hover:text-white_4 hover:bg-black_3 cursor-pointer': !isFirst,
            'text-grey_2 opacity-50 cursor-not-allowed': isFirst,
          },
        )}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="w-[36px] h-[36px] flex items-center justify-center font-manrope text-14 text-grey_2"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={classNames(
              'w-[36px] h-[36px] rounded-8px flex items-center justify-center font-manrope text-14 transition-colors cursor-pointer',
              {
                'bg-pr_purple text-white': page === currentPage,
                'text-grey_4 hover:text-white_4 hover:bg-black_3': page !== currentPage,
              },
            )}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={classNames(
          'w-[36px] h-[36px] rounded-8px flex items-center justify-center transition-colors',
          {
            'text-grey_4 hover:text-white_4 hover:bg-black_3 cursor-pointer': !isLast,
            'text-grey_2 opacity-50 cursor-not-allowed': isLast,
          },
        )}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </nav>
  );
}
