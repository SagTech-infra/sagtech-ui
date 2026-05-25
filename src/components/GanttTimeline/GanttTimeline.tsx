'use client';

import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Modal } from '@/components/Modal/Modal';
import { useLocale } from '@/providers/LocaleContext';

export interface GanttItem {
  id: string;
  label: string;
  /** Inclusive start date. */
  start: Date | string;
  /** Inclusive end date. */
  end: Date | string;
  color?: 'purple' | 'blue' | 'success' | 'warning' | 'error' | 'grey';
  /** Optional grouping row label. */
  lane?: string;
  progress?: number;
}

export type GanttScale = 'day' | 'week' | 'month';

export interface GanttTimelineProps {
  items: GanttItem[];
  scale?: GanttScale;
  /** Start of the visible range. Defaults to earliest item start (rounded to scale). */
  rangeStart?: Date;
  /** End of the visible range. Defaults to latest item end. */
  rangeEnd?: Date;
  /** Called when a bar is clicked. Fires before the built-in detail-modal (if any). */
  onItemClick?: (item: GanttItem) => void;
  /**
   * When provided, clicking a bar opens a detail modal rendering this node.
   * Receives the clicked item + a close-callback. Takes priority over the
   * default title-only modal.
   */
  renderItemDetail?: (item: GanttItem, close: () => void) => React.ReactNode;
  /** Title for the detail modal. Defaults to the item's label. */
  detailModalTitle?: (item: GanttItem) => React.ReactNode;
  /** Modal size. Defaults to `'md'`. */
  detailModalSize?: 'sm' | 'md';
  className?: string;
  laneHeight?: number;
  rowLabelWidth?: number;
  /** Label shown in the top-left header cell above lane names. Defaults to 'Lane'. */
  laneHeaderLabel?: string;
  /** BCP-47 locale; falls back to LocaleProvider, then 'en-US'. Controls tick label language. */
  locale?: string;
}

const colorMap = {
  purple: { bg: 'bg-pr_purple/30', border: 'border-pr_purple', fill: 'bg-pr_purple' },
  blue: { bg: 'bg-pr_blue/30', border: 'border-pr_blue', fill: 'bg-pr_blue' },
  success: { bg: 'bg-success/20', border: 'border-success', fill: 'bg-success' },
  warning: { bg: 'bg-warning/20', border: 'border-warning', fill: 'bg-warning' },
  error: { bg: 'bg-error/20', border: 'border-error', fill: 'bg-error' },
  grey: { bg: 'bg-bg-tertiary', border: 'border-border-default', fill: 'bg-grey_2' },
} as const;

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** ISO-8601 week number (1-53), same as what spreadsheets show. */
function isoWeek(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
}

/**
 * Greedy sub-row packing — each item goes into the first sub-row that has no
 * overlap with an existing bar. Returns a parallel array of sub-row indices.
 */
function packSubRows(items: GanttItem[]): number[] {
  const sorted = items
    .map((it, idx) => ({ idx, start: toDate(it.start).getTime(), end: toDate(it.end).getTime() }))
    .sort((a, b) => a.start - b.start);

  const rowEnds: number[] = []; // latest end per row
  const rowByIdx: number[] = new Array(items.length);

  sorted.forEach(({ idx, start, end }) => {
    let placed = false;
    for (let r = 0; r < rowEnds.length; r++) {
      if (start > rowEnds[r]) {
        rowEnds[r] = end;
        rowByIdx[idx] = r;
        placed = true;
        break;
      }
    }
    if (!placed) {
      rowEnds.push(end);
      rowByIdx[idx] = rowEnds.length - 1;
    }
  });

  return rowByIdx;
}

export default function GanttTimeline({
  items,
  scale = 'day',
  rangeStart,
  rangeEnd,
  onItemClick,
  renderItemDetail,
  detailModalTitle,
  detailModalSize = 'md',
  className,
  laneHeight = 44,
  rowLabelWidth = 160,
  laneHeaderLabel = 'Lane',
  locale: localeProp,
}: GanttTimelineProps) {
  const { locale: ctxLocale } = useLocale();
  const locale = localeProp ?? ctxLocale;
  const [openItem, setOpenItem] = useState<GanttItem | null>(null);

  const { start, end, ticks, dayWidth } = useMemo(() => {
    if (items.length === 0) {
      const now = startOfDay(new Date());
      return { start: now, end: now, ticks: [now], dayWidth: 32 };
    }
    const starts = items.map((i) => toDate(i.start).getTime());
    const ends = items.map((i) => toDate(i.end).getTime());
    const resolvedStart = startOfDay(rangeStart ?? new Date(Math.min(...starts)));
    const resolvedEnd = startOfDay(rangeEnd ?? new Date(Math.max(...ends)));

    const daysSpan = Math.max(
      1,
      Math.ceil((resolvedEnd.getTime() - resolvedStart.getTime()) / DAY_MS) + 1,
    );

    const tickStep = scale === 'day' ? 1 : scale === 'week' ? 7 : 30;
    const tickList: Date[] = [];
    for (let i = 0; i <= daysSpan; i += tickStep) {
      const d = new Date(resolvedStart.getTime() + i * DAY_MS);
      tickList.push(d);
    }

    return {
      start: resolvedStart,
      end: resolvedEnd,
      ticks: tickList,
      dayWidth: scale === 'day' ? 48 : scale === 'week' ? 22 : 4,
    };
  }, [items, scale, rangeStart, rangeEnd]);

  const lanes = useMemo(() => {
    const buildLane = (laneName: string, laneItems: GanttItem[]) => {
      const rows = packSubRows(laneItems);
      const subRowCount = rows.length === 0 ? 1 : Math.max(...rows) + 1;
      return { lane: laneName, items: laneItems, rows, subRowCount };
    };

    if (items.every((i) => !i.lane)) {
      return [buildLane('', items)];
    }
    const map = new Map<string, GanttItem[]>();
    items.forEach((it) => {
      const lane = it.lane ?? '';
      const list = map.get(lane) ?? [];
      list.push(it);
      map.set(lane, list);
    });
    return Array.from(map.entries()).map(([lane, lineItems]) => buildLane(lane, lineItems));
  }, [items]);

  const totalDays =
    Math.max(1, Math.ceil((end.getTime() - start.getTime()) / DAY_MS) + 1);
  const contentWidth = totalDays * dayWidth;

  const computeX = (date: Date) =>
    Math.max(0, (startOfDay(date).getTime() - start.getTime()) / DAY_MS) * dayWidth;

  const handleBarClick = (item: GanttItem) => {
    onItemClick?.(item);
    if (renderItemDetail) setOpenItem(item);
  };

  return (
    <div
      className={classNames(
        'border border-solid border-border-default rounded-16px overflow-hidden bg-bg-primary',
        className,
      )}
    >
      <div className="overflow-x-auto custom-scrollbar">
        <div style={{ width: rowLabelWidth + contentWidth }}>
          {/* Header row with ticks */}
          <div className="flex border-b border-solid border-border-default bg-bg-secondary">
            <div
              className="flex-shrink-0 px-16px py-10px font-manrope text-10 font-bold text-fg-muted uppercase tracking-[0.12em] border-r border-solid border-border-default flex items-end"
              style={{ width: rowLabelWidth, height: 48 }}
            >
              {laneHeaderLabel}
            </div>
            <div className="relative" style={{ width: contentWidth, height: 48 }}>
              {ticks.map((tick, i) => {
                const isMonthStart = tick.getDate() === 1 || i === 0;
                const isWeekend =
                  scale === 'day' && (tick.getDay() === 0 || tick.getDay() === 6);
                const weekday =
                  scale === 'day'
                    ? tick.toLocaleDateString(locale, { weekday: 'short' })
                    : null;
                const monthLabel = tick.toLocaleDateString(locale, { month: 'short' });
                return (
                  <div
                    key={i}
                    className={classNames(
                      'absolute top-0 h-full flex flex-col items-center justify-center border-l border-solid font-manrope',
                      isMonthStart ? 'border-l-pr_purple/40' : 'border-l-black_3',
                      isWeekend && 'bg-bg-tertiary/30',
                    )}
                    style={{ left: computeX(tick), width: dayWidth }}
                  >
                    {scale === 'day' && (
                      <>
                        <span
                          className={classNames(
                            'text-10 uppercase tracking-wider leading-tight',
                            isWeekend ? 'text-fg-muted' : 'text-fg-muted',
                          )}
                        >
                          {isMonthStart ? monthLabel : weekday}
                        </span>
                        <span
                          className={classNames(
                            'text-12 font-semibold leading-tight mt-2px',
                            isWeekend ? 'text-fg-muted' : 'text-fg-primary',
                          )}
                        >
                          {tick.getDate()}
                        </span>
                      </>
                    )}
                    {scale === 'week' && (
                      <>
                        <span className="text-10 uppercase tracking-wider text-fg-muted leading-tight">
                          W{isoWeek(tick)}
                        </span>
                        <span className="text-10 font-semibold text-fg-primary leading-tight mt-2px">
                          {monthLabel} {tick.getDate()}
                        </span>
                      </>
                    )}
                    {scale === 'month' && (
                      <span className="text-10 text-fg-muted uppercase tracking-wider">
                        {tick.toLocaleDateString(locale, { month: 'short', year: '2-digit' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lanes */}
          {lanes.map(({ lane, items: laneItems, rows, subRowCount }, laneIndex) => {
            const actualLaneHeight = Math.max(laneHeight, subRowCount * laneHeight);
            return (
              <div
                key={lane || `__default-${laneIndex}`}
                className="flex border-b border-solid border-border-default last:border-b-0"
              >
                <div
                  className="flex-shrink-0 px-12px py-8px font-manrope text-12 text-fg-primary border-r border-solid border-border-default flex items-center"
                  style={{ width: rowLabelWidth, minHeight: actualLaneHeight }}
                >
                  {lane || '—'}
                </div>
                <div
                  className="relative"
                  style={{ width: contentWidth, minHeight: actualLaneHeight }}
                >
                  {/* Vertical grid lines + weekend tint */}
                  {ticks.map((tick, i) => {
                    const isMonthStart = tick.getDate() === 1 || i === 0;
                    const isWeekend =
                      scale === 'day' && (tick.getDay() === 0 || tick.getDay() === 6);
                    return (
                      <div
                        key={`grid-${i}`}
                        className={classNames(
                          'absolute top-0 bottom-0 border-l border-solid',
                          isMonthStart
                            ? 'border-l-pr_purple/30'
                            : 'border-l-black_3 opacity-40',
                          isWeekend && 'bg-bg-tertiary/20',
                        )}
                        style={{
                          left: computeX(tick),
                          width: isWeekend ? dayWidth : undefined,
                        }}
                      />
                    );
                  })}
                  {/* Bars */}
                  {laneItems.map((it, idx) => {
                    const bar = colorMap[it.color ?? 'purple'];
                    const x = computeX(toDate(it.start));
                    const width = Math.max(
                      dayWidth / 2,
                      ((toDate(it.end).getTime() - toDate(it.start).getTime()) / DAY_MS + 1) *
                        dayWidth,
                    );
                    const rowIdx = rows[idx] ?? 0;
                    const topOffset = rowIdx * laneHeight + 6;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => handleBarClick(it)}
                        className={classNames(
                          'absolute rounded-8px border border-solid overflow-hidden cursor-pointer hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pr_purple',
                          bar.bg,
                          bar.border,
                        )}
                        style={{
                          left: x,
                          top: topOffset,
                          width: Math.max(12, width - 4),
                          height: laneHeight - 14,
                        }}
                      >
                        {typeof it.progress === 'number' && (
                          <div
                            className={classNames(
                              'absolute left-0 top-0 h-full',
                              bar.fill,
                            )}
                            style={{
                              width: `${Math.max(0, Math.min(100, it.progress))}%`,
                              opacity: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-[1] px-8px font-manrope text-12 text-fg-primary truncate block leading-[30px]">
                          {it.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderItemDetail && (
        <Modal
          isOpen={Boolean(openItem)}
          toggle={() => setOpenItem(null)}
          size={detailModalSize}
          title={openItem ? (detailModalTitle ? detailModalTitle(openItem) : openItem.label) : undefined}
        >
          {openItem && renderItemDetail(openItem, () => setOpenItem(null))}
        </Modal>
      )}
    </div>
  );
}
