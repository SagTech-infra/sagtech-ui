'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useLocale } from '@/providers/LocaleContext';
import { catmullRomSpline } from '../LineChart/spline';
import type { AreaChartProps } from './types';

interface HoverState {
  dataIndex: number;
  x: number;
  y: number;
}

function AreaChart({
  series,
  width = '100%',
  height = 350,
  stacked = false,
  gradient = true,
}: AreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { palette: COLORS } = useThemeColors();
  const { locale } = useLocale();
  const layoutRef = useRef<{
    padding: { top: number; right: number; bottom: number; left: number };
    chartW: number;
    chartH: number;
    stepCount: number;
    labels: string[];
    minY: number;
    maxY: number;
  } | null>(null);

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
    const stepCount = Math.max(labels.length - 1, 1);

    // Compute stacked totals if necessary
    const stackedValues: number[][] = stacked
      ? series.map((_, si) =>
          labels.map((_, li) =>
            series.slice(0, si + 1).reduce((acc, s) => acc + (s.data[li]?.y ?? 0), 0),
          ),
        )
      : series.map((s) => s.data.map((d) => d.y));

    const flat = stackedValues.flat();
    const rawMax = flat.length ? Math.max(...flat) : 100;
    const minY = 0;
    const maxY = Math.ceil(rawMax / 10) * 10 || 100;

    layoutRef.current = { padding, chartW, chartH, stepCount, labels, minY, maxY };

    ctx.clearRect(0, 0, w, h);

    // Horizontal grid + Y labels
    const gridLines = 5;
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

      const val = Math.round(maxY - (maxY - minY) * (i / gridLines));
      ctx.fillStyle = tokens.colors.grey_1;
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(new Intl.NumberFormat(locale).format(val), padding.left - 12, y);
    }

    // X axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '11px Manrope, sans-serif';
    labels.forEach((label, i) => {
      const x = padding.left + (chartW / stepCount) * i;
      ctx.fillStyle = hover?.dataIndex === i ? tokens.colors.white_4 : tokens.colors.grey_1;
      ctx.fillText(label, x, padding.top + chartH + 12);
    });

    // Hover line
    if (hover !== null) {
      const hoverX = padding.left + (chartW / stepCount) * hover.dataIndex;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hoverX, padding.top);
      ctx.lineTo(hoverX, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const valueToY = (v: number) =>
      padding.top + chartH - ((v - minY) / (maxY - minY)) * chartH;

    // Draw stacked from top to bottom of the stack visually so the lower
    // series sits in front of higher ones (since stack values grow upward).
    series.forEach((s, si) => {
      const color = COLORS[si % COLORS.length];

      const yVals = stackedValues[si];
      const points = yVals.map((y, i) => ({
        x: padding.left + (chartW / stepCount) * i,
        y: valueToY(y),
      }));

      // Baseline: previous stacked series, or chart bottom for non-stacked / first series.
      const baselineYs =
        stacked && si > 0 ? stackedValues[si - 1] : yVals.map(() => minY);
      const baselinePts = baselineYs.map((y, i) => ({
        x: padding.left + (chartW / stepCount) * i,
        y: valueToY(y),
      }));

      // Fill (gradient or solid alpha)
      ctx.beginPath();
      catmullRomSpline(points, ctx, 3);
      // Walk back along baseline
      for (let i = baselinePts.length - 1; i >= 0; i--) {
        ctx.lineTo(baselinePts[i].x, baselinePts[i].y);
      }
      ctx.closePath();

      if (gradient) {
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, color + '55');
        grad.addColorStop(0.7, color + '18');
        grad.addColorStop(1, color + '02');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = color + '55';
      }
      ctx.fill();

      // Stroke
      ctx.save();
      ctx.shadowColor = color + '60';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      catmullRomSpline(points, ctx, 3);
      ctx.stroke();
      ctx.restore();

      // Markers on hover
      if (hover !== null) {
        const p = points[hover.dataIndex];
        if (p) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = tokens.colors.black_1;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }
    });

    // Legend
    ctx.font = '12px Manrope, sans-serif';
    let totalLegendW = 0;
    series.forEach((s) => {
      totalLegendW += 14 + ctx.measureText(s.name).width + 28;
    });
    totalLegendW -= 28;

    let legendX = w / 2 - totalLegendW / 2;
    const legendY = padding.top + chartH + 36;
    series.forEach((s, si) => {
      const color = COLORS[si % COLORS.length];
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = tokens.colors.grey_3;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.name, legendX + 14, legendY);
      legendX += 14 + ctx.measureText(s.name).width + 28;
    });
  }, [series, hover, stacked, gradient, COLORS, locale]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const layout = layoutRef.current;
      if (!canvas || !layout || !series?.length) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { padding, chartW, chartH, stepCount } = layout;

      if (
        mx < padding.left - 10 ||
        mx > padding.left + chartW + 10 ||
        my < padding.top - 10 ||
        my > padding.top + chartH + 10
      ) {
        if (hover !== null) setHover(null);
        return;
      }

      const relX = mx - padding.left;
      const colWidth = chartW / stepCount;
      const dataIndex = Math.round(relX / colWidth);
      const clampedIndex = Math.max(0, Math.min(dataIndex, stepCount));

      if (hover?.dataIndex !== clampedIndex) {
        const snapX = padding.left + colWidth * clampedIndex;
        setHover({ dataIndex: clampedIndex, x: snapX, y: my });
      }
    },
    [series, hover],
  );

  const handleMouseLeave = useCallback(() => {
    setHover(null);
  }, []);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  const tooltipData =
    hover !== null && series
      ? series.map((s, si) => ({
          name: s.name,
          value: s.data[hover.dataIndex]?.y ?? 0,
          color: COLORS[si % COLORS.length],
        }))
      : [];
  const tooltipLabel =
    hover !== null && layoutRef.current ? layoutRef.current.labels[hover.dataIndex] : '';

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: typeof width === 'number' ? `${width}px` : width }}>
      <canvas
        ref={canvasRef}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: `${height}px`,
          display: 'block',
          cursor: 'crosshair',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hover !== null && tooltipData.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: hover.x,
            top: (layoutRef.current?.padding.top ?? 24) - 8,
            transform: 'translateX(-50%)',
            background: tokens.colors.black_2,
            border: '1px solid rgba(109, 62, 241, 0.3)',
            borderRadius: '10px',
            padding: '10px 16px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            zIndex: 10,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: tokens.colors.grey_3,
              marginBottom: '6px',
              fontWeight: 600,
            }}
          >
            {tooltipLabel}
          </div>
          {tooltipData.map((d) => (
            <div
              key={d.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: tokens.colors.white_4,
                fontWeight: 500,
                marginTop: '3px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: d.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: tokens.colors.grey_3 }}>{d.name}:</span>
              <span style={{ fontWeight: 700 }}>{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AreaChart;
