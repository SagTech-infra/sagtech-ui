"use client";

import { useMemo, useState } from "react";
import classNames from "classnames";

export interface PaginationProps {
  // Offset mode (existing) — required by convention when mode="offset" (default)
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;

  // Cursor mode (new)
  mode?: "offset" | "cursor";
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;

  // Shared (new)
  loading?: boolean;
  disabled?: boolean;
  size?: "default" | "compact";
  label?: React.ReactNode;

  className?: string;
}

function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | "ellipsis")[] {
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
    return [...leftRange, "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblingCount * 2 + 3;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + 1 + i,
    );
    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
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

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  mode = "offset",
  hasPrevious,
  hasNext,
  onPreviousPage,
  onNextPage,
  loading = false,
  disabled = false,
  size = "default",
  label,
  className,
}: PaginationProps) {
  // Track which side was last clicked to show spinner on that side.
  // Must be declared unconditionally before any early return.
  const [loadingSide, setLoadingSide] = useState<"prev" | "next" | null>(null);

  // Offset-mode derived values — computed unconditionally to satisfy the Rules of Hooks.
  const safeCurrentPage = currentPage ?? 1;
  const safeTotalPages = totalPages ?? 1;
  const pages = useMemo(
    () => generatePageRange(safeCurrentPage, safeTotalPages, siblingCount),
    [safeCurrentPage, safeTotalPages, siblingCount],
  );

  const navButtonClass = classNames(
    "rounded-8px flex items-center justify-center gap-4px transition-colors font-manrope text-14",
    size === "compact" ? "py-4px px-8px" : "py-8px px-8px",
  );

  // ── Cursor mode ───────────────────────────────────────────────────────────
  if (mode === "cursor") {
    const prevDisabled = disabled || loading || !hasPrevious;
    const nextDisabled = disabled || loading || !hasNext;

    const handlePrev = () => {
      if (prevDisabled) return;
      setLoadingSide("prev");
      onPreviousPage?.();
    };

    const handleNext = () => {
      if (nextDisabled) return;
      setLoadingSide("next");
      onNextPage?.();
    };

    const showPrevSpinner = loading && loadingSide === "prev";
    const showNextSpinner = loading && loadingSide === "next";

    return (
      <nav
        className={classNames("flex items-center gap-8px", className)}
        aria-label="Pagination"
      >
        <button
          type="button"
          disabled={prevDisabled}
          onClick={handlePrev}
          className={classNames(navButtonClass, {
            "text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary cursor-pointer":
              !prevDisabled,
            "text-fg-muted opacity-50 cursor-not-allowed": prevDisabled,
          })}
          aria-label="Previous page"
        >
          {showPrevSpinner ? <Spinner /> : <ChevronLeft />}
          <span>Previous</span>
        </button>

        {label != null && (
          <span className="font-manrope text-12 text-fg-muted px-8px">
            {label}
          </span>
        )}

        <button
          type="button"
          disabled={nextDisabled}
          onClick={handleNext}
          className={classNames(navButtonClass, {
            "text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary cursor-pointer":
              !nextDisabled,
            "text-fg-muted opacity-50 cursor-not-allowed": nextDisabled,
          })}
          aria-label="Next page"
        >
          <span>Next</span>
          {showNextSpinner ? <Spinner /> : <ChevronRight />}
        </button>
      </nav>
    );
  }

  // ── Offset mode (default) ─────────────────────────────────────────────────
  const isFirst = safeCurrentPage === 1;
  const isLast = safeCurrentPage === safeTotalPages;

  const prevDisabled = disabled || loading || isFirst;
  const nextDisabled = disabled || loading || isLast;

  const handlePrev = () => {
    if (prevDisabled) return;
    setLoadingSide("prev");
    onPageChange?.(safeCurrentPage - 1);
  };

  const handleNext = () => {
    if (nextDisabled) return;
    setLoadingSide("next");
    onPageChange?.(safeCurrentPage + 1);
  };

  const showPrevSpinner = loading && loadingSide === "prev";
  const showNextSpinner = loading && loadingSide === "next";

  return (
    <nav
      className={classNames("flex flex-col items-center gap-8px", className)}
      aria-label="Pagination"
    >
      <div className="flex items-center gap-4px">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={handlePrev}
          className={classNames(
            "w-[36px] h-[36px] rounded-8px flex items-center justify-center transition-colors",
            size === "compact" ? "py-4px" : "",
            {
              "text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary cursor-pointer":
                !prevDisabled,
              "text-fg-muted opacity-50 cursor-not-allowed": prevDisabled,
            },
          )}
          aria-label="Previous page"
        >
          {showPrevSpinner ? <Spinner /> : <ChevronLeft />}
        </button>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="w-[36px] h-[36px] flex items-center justify-center font-manrope text-14 text-fg-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              disabled={disabled || loading}
              onClick={() => onPageChange?.(page)}
              className={classNames(
                "w-[36px] rounded-8px flex items-center justify-center font-manrope text-14 transition-colors",
                size === "compact" ? "py-4px" : "h-[36px]",
                {
                  "bg-pr_purple text-white cursor-pointer":
                    page === safeCurrentPage && !disabled && !loading,
                  "bg-pr_purple text-white opacity-70 cursor-not-allowed":
                    page === safeCurrentPage && (disabled || loading),
                  "text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary cursor-pointer":
                    page !== safeCurrentPage && !disabled && !loading,
                  "text-fg-muted opacity-50 cursor-not-allowed":
                    page !== safeCurrentPage && (disabled || loading),
                },
              )}
              aria-current={page === safeCurrentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={nextDisabled}
          onClick={handleNext}
          className={classNames(
            "w-[36px] h-[36px] rounded-8px flex items-center justify-center transition-colors",
            size === "compact" ? "py-4px" : "",
            {
              "text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary cursor-pointer":
                !nextDisabled,
              "text-fg-muted opacity-50 cursor-not-allowed": nextDisabled,
            },
          )}
          aria-label="Next page"
        >
          {showNextSpinner ? <Spinner /> : <ChevronRight />}
        </button>
      </div>

      {label != null && (
        <span className="font-manrope text-12 text-fg-muted">{label}</span>
      )}
    </nav>
  );
}
