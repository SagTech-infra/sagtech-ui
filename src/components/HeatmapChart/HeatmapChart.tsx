'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { HeatmapChartProps } from './types';

interface HoverState {
  xi: number;
  yi: number;
  value: number;
  x: number;
  y: number;
}

interface CellRect {
  x: number;
  y: number;
  w: number;
  h: number;
  xi: number;
  yi: number;
  value: number;
}

// Parse #RRGGBB into [r, g, b]. Falls back to mid grey on parse failure.
function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [128, 128, 128];
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function HeatmapChart({
  data,
  xLabels,
  yLabels,
  width = '100%',
  height = 350,
  colorScale,
}: HeatmapChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const cellsRef = useRef<CellRect[]>([]);
  const { colors, ui } = useThemeColors();

  const groutColor = ui['bg-primary'];
  const axisColor = ui['fg-muted'];
  const axisActiveColor = ui['fg-primary'];

  const fromColor = colorScale?.[0] ?? colors.pr_blue;
  const toColor = colorScale?.[1] ?? colors.pr_purple;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 16, right: 24, bottom: 40, left: 80 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const cols = xLabels.length || 1;
    const rows = yLabels.length || 1;
    const cellW = chartW / cols;
    const cellH = chartH / rows;

    let minV = Infinity;
    let maxV = -Infinity;
    data.forEach((d) => {
      if (d.value < minV) minV = d.value;
      if (d.value > maxV) maxV = d.value;
    });
    if (!isFinite(minV)) minV = 0;
    if (!isFinite(maxV)) maxV = 1;
    if (maxV === minV) maxV = minV + 1;

    ctx.clearRect(0, 0, w, h);

    const fromRgb = parseHex(fromColor);
    const toRgb = parseHex(toColor);

    const cells: CellRect[] = [];

    for (let yi = 0; yi < rows; yi++) {
      for (let xi = 0; xi < cols; xi++) {
        const datum = data.find((d) => {
          const xMatches =
            d.x === xLabels[xi] || (typeof d.x === 'number' && d.x === xi);
          const yMatches =
            d.y === yLabels[yi] || (typeof d.y === 'number' && d.y === yi);
          return xMatches && yMatches;
        });
        const value = datum?.value ?? 0;
        const t = (value - minV) / (maxV - minV);
        const color = lerpColor(fromRgb, toRgb, Math.max(0, Math.min(1, t)));

        const cx = padding.left + xi * cellW;
        const cy = padding.top + yi * cellH;
        const isHovered = hover?.xi === xi && hover?.yi === yi;

        ctx.fillStyle = color;
        ctx.beginPath();
        const r = 4;
        const x = cx + 1;
        const y = cy + 1;
        const cw = cellW - 2;
        const ch = cellH - 2;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + cw - r, y);
        ctx.quadraticCurveTo(x + cw, y, x + cw, y + r);
        ctx.lineTo(x + cw, y + ch - r);
        ctx.quadraticCurveTo(x + cw, y + ch, x + cw - r, y + ch);
        ctx.lineTo(x + r, y + ch);
        ctx.quadraticCurveTo(x, y + ch, x, y + ch - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = groutColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        cells.push({ x: cx, y: cy, w: cellW, h: cellH, xi, yi, value });
      }
    }

    cellsRef.current = cells;

    // X labels (top? bottom). Use bottom.
    ctx.font = '11px Manrope, sans-serif';
    ctx.fillStyle = axisColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    xLabels.forEach((label, i) => {
      const cx = padding.left + cellW * (i + 0.5);
      ctx.fillStyle =
        hover?.xi === i ? axisActiveColor : axisColor;
      ctx.fillText(label, cx, padding.top + chartH + 8);
    });

    // Y labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    yLabels.forEach((label, i) => {
      const cy = padding.top + cellH * (i + 0.5);
      ctx.fillStyle =
        hover?.yi === i ? axisActiveColor : axisColor;
      ctx.fillText(label, padding.left - 12, cy);
    });
  }, [data, xLabels, yLabels, hover, fromColor, toColor, groutColor, axisColor, axisActiveColor]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const found = cellsRef.current.find(
        (c) => mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h,
      );
      if (found) {
        if (hover?.xi !== found.xi || hover?.yi !== found.yi) {
          setHover({ xi: found.xi, yi: found.yi, value: found.value, x: mx, y: my });
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
            top: hover.y - 56,
            transform: 'translateX(-50%)',
            background: 'var(--color-bg-secondary)',
            border: `1px solid ${toColor}80`,
            borderRadius: '10px',
            padding: '8px 14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            zIndex: 10,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-fg-secondary)', fontWeight: 600 }}>
            {xLabels[hover.xi]} / {yLabels[hover.yi]}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--color-fg-primary)',
              fontWeight: 700,
              marginTop: '2px',
            }}
          >
            {hover.value}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeatmapChart;
