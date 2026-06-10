'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useLocale } from '@/providers/LocaleContext';
import type { LineChartSeriesType } from './types';
import { catmullRomSpline } from './spline';

export interface LineChartTypes {
  series?: LineChartSeriesType[];
  width?: number | string;
  height?: number | string;
}

interface HoverState {
  dataIndex: number;
  x: number;
  y: number;
}

function LineChart({ series, width = '100%', height = 350 }: LineChartTypes) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { palette: COLORS, ui } = useThemeColors();
  // Per-theme structural colors, read as primitives so draw deps stay stable.
  const gridColor = ui['border-default'];
  const guideColor = ui['border-strong'];
  const axisColor = ui['fg-muted'];
  const axisActiveColor = ui['fg-primary'];
  const mutedColor = ui['fg-secondary'];
  const holeColor = ui['bg-primary'];
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
    const padding = { top: 24, right: 24, bottom: 72, left: 52 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    let allY: number[] = [];
    let labels: string[] = [];
    series.forEach((s) => {
      if (s.data) {
        allY = allY.concat(s.data.map((d) => d.y));
        if (!labels.length) labels = s.data.map((d) => d.x);
      }
    });
    const minY = 0;
    const rawMax = Math.max(...allY);
    const maxY = Math.ceil(rawMax / 10) * 10 || 100;
    const stepCount = Math.max(labels.length - 1, 1);

    layoutRef.current = { padding, chartW, chartH, stepCount, labels, minY, maxY };

    ctx.clearRect(0, 0, w, h);

    // Horizontal grid
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      const val = Math.round(maxY - (maxY - minY) * (i / gridLines));
      ctx.fillStyle = axisColor;
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
      ctx.fillStyle = hover?.dataIndex === i ? axisActiveColor : axisColor;
      ctx.fillText(label, x, padding.top + chartH + 12);
    });

    // Vertical hover line
    if (hover !== null) {
      const hoverX = padding.left + (chartW / stepCount) * hover.dataIndex;
      ctx.strokeStyle = guideColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hoverX, padding.top);
      ctx.lineTo(hoverX, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw each series
    series.forEach((s, si) => {
      if (!s.data) return;
      const color = COLORS[si % COLORS.length];

      const points = s.data.map((d, i) => ({
        x: padding.left + (chartW / stepCount) * i,
        y: padding.top + chartH - ((d.y - minY) / (maxY - minY)) * chartH,
      }));

      // Gradient area fill
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, color + '30');
      gradient.addColorStop(0.7, color + '08');
      gradient.addColorStop(1, color + '00');

      ctx.beginPath();
      catmullRomSpline(points, ctx, 3);
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.lineTo(points[0].x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line with shadow
      ctx.save();
      ctx.shadowColor = color + '60';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      catmullRomSpline(points, ctx, 3);
      ctx.stroke();
      ctx.restore();

      // Markers
      points.forEach((p, pi) => {
        const isActive = hover?.dataIndex === pi;
        const radius = isActive ? 7 : 5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = holeColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 3 : 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, isActive ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    });

    // Separator line
    const sepY = padding.top + chartH + 36;
    const sepGradient = ctx.createLinearGradient(padding.left + chartW * 0.2, 0, padding.left + chartW * 0.8, 0);
    sepGradient.addColorStop(0, 'rgba(109, 62, 241, 0)');
    sepGradient.addColorStop(0.3, 'rgba(109, 62, 241, 0.25)');
    sepGradient.addColorStop(0.5, 'rgba(109, 62, 241, 0.4)');
    sepGradient.addColorStop(0.7, 'rgba(109, 62, 241, 0.25)');
    sepGradient.addColorStop(1, 'rgba(109, 62, 241, 0)');
    ctx.strokeStyle = sepGradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left + chartW * 0.1, sepY);
    ctx.lineTo(padding.left + chartW * 0.9, sepY);
    ctx.stroke();

    // Legend centered
    ctx.font = '12px Manrope, sans-serif';
    let totalLegendW = 0;
    series.forEach((s) => {
      totalLegendW += 14 + ctx.measureText(s.name).width + 28;
    });
    totalLegendW -= 28;

    let legendX = w / 2 - totalLegendW / 2;
    const legendY = sepY + 16;
    series.forEach((s, si) => {
      const color = COLORS[si % COLORS.length];
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = mutedColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.name, legendX + 14, legendY);
      legendX += 14 + ctx.measureText(s.name).width + 28;
    });
  }, [
    series,
    hover,
    COLORS,
    locale,
    gridColor,
    guideColor,
    axisColor,
    axisActiveColor,
    mutedColor,
    holeColor,
  ]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const layout = layoutRef.current;
      if (!canvas || !layout || !series?.length) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { padding, chartW, chartH, stepCount } = layout;

      // Check if within chart area
      if (
        mx < padding.left - 10 ||
        mx > padding.left + chartW + 10 ||
        my < padding.top - 10 ||
        my > padding.top + chartH + 10
      ) {
        if (hover !== null) setHover(null);
        return;
      }

      // Snap to nearest data point column
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

  // Tooltip data
  const tooltipData =
    hover !== null && series
      ? series
          .map((s, si) => ({
            name: s.name,
            value: s.data?.[hover.dataIndex]?.y ?? 0,
            color: COLORS[si % COLORS.length],
          }))
          .filter((d) => d.value !== undefined)
      : [];
  const tooltipLabel =
    hover !== null && layoutRef.current ? layoutRef.current.labels[hover.dataIndex] : '';

  return (
    <div style={{ position: 'relative', width: typeof width === 'number' ? '100%' : width, maxWidth: typeof width === 'number' ? `${width}px` : undefined }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
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
            background: 'var(--color-bg-secondary)',
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
              color: 'var(--color-fg-secondary)',
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
                color: 'var(--color-fg-primary)',
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
              <span style={{ color: 'var(--color-fg-secondary)' }}>{d.name}:</span>
              <span style={{ fontWeight: 700 }}>{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LineChart;
