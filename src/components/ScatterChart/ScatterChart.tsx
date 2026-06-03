'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useLocale } from '@/providers/LocaleContext';
import type { ScatterChartProps } from './types';

interface HoverState {
  seriesIndex: number;
  pointIndex: number;
  x: number;
  y: number;
}

interface PointRect {
  cx: number;
  cy: number;
  r: number;
  seriesIndex: number;
  pointIndex: number;
}

function ScatterChart({ series, width = '100%', height = 350, xLabel, yLabel }: ScatterChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { palette: COLORS } = useThemeColors();
  const { locale } = useLocale();
  const pointsRef = useRef<PointRect[]>([]);

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
    const padding = { top: 24, right: 24, bottom: yLabel ? 64 : 56, left: xLabel ? 60 : 52 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    series.forEach((s) => {
      s.points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });
    if (!isFinite(minX)) {
      minX = 0;
      maxX = 1;
    }
    if (!isFinite(minY)) {
      minY = 0;
      maxY = 1;
    }
    if (minX === maxX) {
      minX -= 1;
      maxX += 1;
    }
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }

    ctx.clearRect(0, 0, w, h);

    // Grid
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      const val = maxY - (maxY - minY) * (i / gridLines);
      ctx.fillStyle = tokens.colors.grey_1;
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        new Intl.NumberFormat(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(val),
        padding.left - 12,
        y,
      );
    }
    for (let i = 0; i <= gridLines; i++) {
      const x = padding.left + (chartW / gridLines) * i;
      const val = minX + (maxX - minX) * (i / gridLines);
      ctx.fillStyle = tokens.colors.grey_1;
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(
        new Intl.NumberFormat(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(val),
        x,
        padding.top + chartH + 8,
      );
    }

    // Axis labels
    if (xLabel) {
      ctx.fillStyle = tokens.colors.grey_3;
      ctx.font = '12px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(xLabel, padding.left + chartW / 2, h - 4);
    }
    if (yLabel) {
      ctx.save();
      ctx.translate(14, padding.top + chartH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = tokens.colors.grey_3;
      ctx.font = '12px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(yLabel, 0, 0);
      ctx.restore();
    }

    const points: PointRect[] = [];

    series.forEach((s, si) => {
      const color = COLORS[si % COLORS.length];
      s.points.forEach((p, pi) => {
        const cx = padding.left + ((p.x - minX) / (maxX - minX)) * chartW;
        const cy = padding.top + chartH - ((p.y - minY) / (maxY - minY)) * chartH;
        const r = p.size ?? 5;
        const isHovered = hover?.seriesIndex === si && hover?.pointIndex === pi;

        ctx.save();
        if (isHovered) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
        }
        ctx.fillStyle = color + (isHovered ? 'FF' : 'C0');
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        points.push({ cx, cy, r, seriesIndex: si, pointIndex: pi });
      });
    });

    pointsRef.current = points;

    // Legend
    if (series.length > 1) {
      ctx.font = '12px Manrope, sans-serif';
      let totalLegendW = 0;
      series.forEach((s) => {
        totalLegendW += 14 + ctx.measureText(s.name).width + 28;
      });
      totalLegendW -= 28;
      let lx = w / 2 - totalLegendW / 2;
      const ly = h - 30;
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
  }, [series, hover, xLabel, yLabel, COLORS, locale]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Find closest within radius+threshold
      let best: PointRect | null = null;
      let bestDist = Infinity;
      pointsRef.current.forEach((p) => {
        const dx = mx - p.cx;
        const dy = my - p.cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= p.r + 4 && d < bestDist) {
          bestDist = d;
          best = p;
        }
      });
      if (best) {
        const candidate = best as PointRect;
        if (
          hover?.seriesIndex !== candidate.seriesIndex ||
          hover?.pointIndex !== candidate.pointIndex
        ) {
          setHover({
            seriesIndex: candidate.seriesIndex,
            pointIndex: candidate.pointIndex,
            x: candidate.cx,
            y: candidate.cy,
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

  const tooltipPoint =
    hover !== null ? series[hover.seriesIndex]?.points[hover.pointIndex] : null;
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
          cursor: 'crosshair',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hover !== null && tooltipPoint && (
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
          <div style={{ fontSize: '11px', color: tokens.colors.grey_3, fontWeight: 600 }}>
            {series[hover.seriesIndex].name}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: tokens.colors.white_4,
              fontWeight: 700,
              marginTop: '2px',
            }}
          >
            x: {tooltipPoint.x}, y: {tooltipPoint.y}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScatterChart;
