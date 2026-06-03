'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useLocale } from '@/providers/LocaleContext';
import type { BarChartProps } from './types';

interface HoverState {
  categoryIndex: number;
  seriesIndex: number;
  x: number;
  y: number;
}

interface BarRect {
  x: number;
  y: number;
  w: number;
  h: number;
  categoryIndex: number;
  seriesIndex: number;
}

function BarChart({
  series,
  width = '100%',
  height = 350,
  orientation = 'vertical',
  stacked = false,
  grouped = false,
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { palette: COLORS } = useThemeColors();
  const { locale } = useLocale();
  const barsRef = useRef<BarRect[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !series?.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 24, right: 24, bottom: 60, left: 52 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const labels = series[0]?.data.map((d) => d.x) ?? [];
    const isStacked = stacked;
    const isGrouped = !stacked && grouped;

    // Determine max value
    let maxV = 0;
    if (isStacked) {
      labels.forEach((_, i) => {
        const total = series.reduce((acc, s) => acc + (s.data[i]?.y ?? 0), 0);
        if (total > maxV) maxV = total;
      });
    } else {
      series.forEach((s) => {
        s.data.forEach((d) => {
          if (d.y > maxV) maxV = d.y;
        });
      });
    }
    const maxY = Math.ceil(maxV / 10) * 10 || 100;

    ctx.clearRect(0, 0, w, h);

    const isVertical = orientation === 'vertical';
    const bars: BarRect[] = [];

    // Grid + axis labels
    const gridLines = 5;
    if (isVertical) {
      for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartH / gridLines) * i;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        const val = Math.round(maxY - maxY * (i / gridLines));
        ctx.fillStyle = tokens.colors.grey_1;
        ctx.font = '11px Manrope, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(new Intl.NumberFormat(locale).format(val), padding.left - 12, y);
      }
    } else {
      for (let i = 0; i <= gridLines; i++) {
        const x = padding.left + (chartW / gridLines) * i;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + chartH);
        ctx.stroke();
        ctx.setLineDash([]);
        const val = Math.round(maxY * (i / gridLines));
        ctx.fillStyle = tokens.colors.grey_1;
        ctx.font = '11px Manrope, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(new Intl.NumberFormat(locale).format(val), x, padding.top + chartH + 8);
      }
    }

    // Category placement
    const categoryCount = labels.length;
    const categoryStride = isVertical ? chartW / categoryCount : chartH / categoryCount;

    // Bar sizing — within each category, leave 30% as gap
    const innerSize = categoryStride * 0.7;
    const barInnerCount = isGrouped ? series.length : 1;
    const barSize = innerSize / barInnerCount;

    labels.forEach((label, ci) => {
      const categoryStart = isVertical
        ? padding.left + categoryStride * ci + (categoryStride - innerSize) / 2
        : padding.top + categoryStride * ci + (categoryStride - innerSize) / 2;

      // Category label
      if (isVertical) {
        const cx = padding.left + categoryStride * (ci + 0.5);
        ctx.fillStyle =
          hover?.categoryIndex === ci ? tokens.colors.white_4 : tokens.colors.grey_1;
        ctx.font = '11px Manrope, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, cx, padding.top + chartH + 8);
      } else {
        const cy = padding.top + categoryStride * (ci + 0.5);
        ctx.fillStyle =
          hover?.categoryIndex === ci ? tokens.colors.white_4 : tokens.colors.grey_1;
        ctx.font = '11px Manrope, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, padding.left - 12, cy);
      }

      let stackedAcc = 0;
      series.forEach((s, si) => {
        const value = s.data[ci]?.y ?? 0;
        const color = COLORS[si % COLORS.length];
        const isHovered = hover?.categoryIndex === ci && hover.seriesIndex === si;

        let barX: number;
        let barY: number;
        let barW: number;
        let barH: number;

        if (isVertical) {
          if (isStacked) {
            const totalLen = (value / maxY) * chartH;
            barX = categoryStart;
            barW = innerSize;
            barH = totalLen;
            barY = padding.top + chartH - stackedAcc - totalLen;
            stackedAcc += totalLen;
          } else if (isGrouped) {
            const len = (value / maxY) * chartH;
            barX = categoryStart + barSize * si;
            barW = barSize;
            barH = len;
            barY = padding.top + chartH - len;
          } else {
            // Single (non-grouped, non-stacked): only first series is meaningful per category
            const len = (value / maxY) * chartH;
            barX = categoryStart;
            barW = innerSize;
            barH = len;
            barY = padding.top + chartH - len;
            if (si > 0) return; // skip duplicate draws
          }
        } else {
          if (isStacked) {
            const totalLen = (value / maxY) * chartW;
            barX = padding.left + stackedAcc;
            barY = categoryStart;
            barW = totalLen;
            barH = innerSize;
            stackedAcc += totalLen;
          } else if (isGrouped) {
            const len = (value / maxY) * chartW;
            barX = padding.left;
            barY = categoryStart + barSize * si;
            barW = len;
            barH = barSize;
          } else {
            const len = (value / maxY) * chartW;
            barX = padding.left;
            barY = categoryStart;
            barW = len;
            barH = innerSize;
            if (si > 0) return;
          }
        }

        bars.push({ x: barX, y: barY, w: barW, h: barH, categoryIndex: ci, seriesIndex: si });

        // Gradient
        const grad = isVertical
          ? ctx.createLinearGradient(barX, barY, barX, barY + barH)
          : ctx.createLinearGradient(barX, barY, barX + barW, barY);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + 'B0');

        ctx.save();
        if (isHovered) {
          ctx.shadowColor = color + '80';
          ctx.shadowBlur = 12;
        }
        ctx.fillStyle = grad;
        const radius = 4;
        // rounded rect (only top corners for vertical / right corners for horizontal)
        const r = Math.min(radius, barW / 2, barH / 2);
        ctx.beginPath();
        if (isVertical) {
          ctx.moveTo(barX, barY + barH);
          ctx.lineTo(barX, barY + r);
          ctx.quadraticCurveTo(barX, barY, barX + r, barY);
          ctx.lineTo(barX + barW - r, barY);
          ctx.quadraticCurveTo(barX + barW, barY, barX + barW, barY + r);
          ctx.lineTo(barX + barW, barY + barH);
          ctx.closePath();
        } else {
          ctx.moveTo(barX, barY);
          ctx.lineTo(barX + barW - r, barY);
          ctx.quadraticCurveTo(barX + barW, barY, barX + barW, barY + r);
          ctx.lineTo(barX + barW, barY + barH - r);
          ctx.quadraticCurveTo(barX + barW, barY + barH, barX + barW - r, barY + barH);
          ctx.lineTo(barX, barY + barH);
          ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      });
    });

    barsRef.current = bars;

    // Legend
    if (series.length > 1) {
      ctx.font = '12px Manrope, sans-serif';
      let totalLegendW = 0;
      series.forEach((s) => {
        totalLegendW += 14 + ctx.measureText(s.name).width + 28;
      });
      totalLegendW -= 28;
      let lx = w / 2 - totalLegendW / 2;
      const ly = h - 16;
      series.forEach((s, si) => {
        const color = COLORS[si % COLORS.length];
        ctx.beginPath();
        ctx.arc(lx + 5, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = tokens.colors.grey_3;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.name, lx + 14, ly);
        lx += 14 + ctx.measureText(s.name).width + 28;
      });
    }
  }, [series, hover, orientation, stacked, grouped, COLORS, locale]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const found = barsRef.current.find(
        (b) => mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h,
      );
      if (found) {
        if (
          hover?.categoryIndex !== found.categoryIndex ||
          hover?.seriesIndex !== found.seriesIndex
        ) {
          setHover({
            categoryIndex: found.categoryIndex,
            seriesIndex: found.seriesIndex,
            x: mx,
            y: my,
          });
        }
      } else if (hover !== null) {
        setHover(null);
      }
    },
    [hover],
  );

  const handleMouseLeave = useCallback(() => setHover(null), []);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  const tooltipSeries = hover !== null ? series[hover.seriesIndex] : null;
  const tooltipValue =
    hover !== null && tooltipSeries ? tooltipSeries.data[hover.categoryIndex]?.y : 0;
  const tooltipLabel =
    hover !== null ? series[0]?.data[hover.categoryIndex]?.x ?? '' : '';
  const tooltipColor =
    hover !== null ? COLORS[hover.seriesIndex % COLORS.length] : tokens.colors.pr_purple;

  return (
    <div style={{ position: 'relative', width: typeof width === 'number' ? '100%' : width, maxWidth: typeof width === 'number' ? `${width}px` : undefined }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'block',
          cursor: 'pointer',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hover !== null && (
        <div
          style={{
            position: 'absolute',
            left: hover.x,
            top: hover.y - 60,
            transform: 'translateX(-50%)',
            background: tokens.colors.black_2,
            border: `1px solid ${tooltipColor}80`,
            borderRadius: '10px',
            padding: '8px 14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 16px ${tooltipColor}40`,
            zIndex: 10,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <div style={{ fontSize: '12px', color: tokens.colors.grey_3, fontWeight: 600 }}>
            {tooltipLabel}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: tokens.colors.white_4,
              fontWeight: 700,
              marginTop: '4px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: tooltipColor,
              }}
            />
            {tooltipSeries && <span style={{ color: tokens.colors.grey_3 }}>{tooltipSeries.name}:</span>}
            <span>{tooltipValue}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarChart;
