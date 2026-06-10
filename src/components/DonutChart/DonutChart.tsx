'use client';

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import { useThemeColors } from '@/hooks/useThemeColors';

interface DonutChartTypes {
  value?: number[];
  width?: number | string;
  colors?: { bgColor: string; color: string }[];
  /** Inner radius as percentage of outer radius (0-100). Higher = thinner ring. */
  size?: number;
  labels?: string[];
}

interface HoverState {
  index: number;
  x: number;
  y: number;
}

function DonutChart({
  value = [100],
  width = 300,
  colors: colorsProp,
  size = 65,
  labels,
}: DonutChartTypes) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const segmentsRef = useRef<{ startAngle: number; endAngle: number }[]>([]);
  const layoutRef = useRef({ cx: 0, cy: 0, outerR: 0, innerR: 0 });
  const { colors: themeColors, ui } = useThemeColors();
  const gridColor = ui['border-default'];
  const holeColor = ui['bg-primary'];
  const axisActiveColor = ui['fg-primary'];
  const mutedColor = ui['fg-secondary'];

  // Segment palette. The first three values come straight from the (theme-aware)
  // design tokens; the last two are purpose-built tints used only by the donut
  // so it can fall back gracefully when more than three segments need colour.
  const DEFAULT_COLORS = useMemo(
    () => [
      { bgColor: themeColors.pr_purple, color: tokens.colors.white },
      { bgColor: themeColors.sec_purple, color: tokens.colors.white },
      { bgColor: themeColors.sec_blue, color: tokens.colors.white },
      { bgColor: '#4A2AAF', color: tokens.colors.white },
      { bgColor: '#E0D6FC', color: '#000000' },
    ],
    [themeColors.pr_purple, themeColors.sec_purple, themeColors.sec_blue],
  );
  const colors = colorsProp ?? DEFAULT_COLORS;

  const maxDim = typeof width === 'number' ? width : 300;
  const total = value.reduce((a, b) => a + b, 0) || 1;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const actualDim = rect.width || maxDim;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = actualDim * dpr;
    canvas.height = actualDim * dpr;
    ctx.scale(dpr, dpr);

    const hasLabelsLocal = labels && labels.length > 0;
    const chartArea = hasLabelsLocal ? actualDim - 40 : actualDim;
    const cx = actualDim / 2;
    const cy = chartArea / 2 + 4;
    const outerR = chartArea / 2 - 12;
    const innerR = outerR * (size / 100);
    const ringWidth = outerR - innerR;
    const gap = value.length > 1 ? 0.04 : 0;

    layoutRef.current = { cx, cy, outerR, innerR };

    ctx.clearRect(0, 0, actualDim, actualDim);

    // Track background
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - ringWidth / 2, 0, Math.PI * 2);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = ringWidth;
    ctx.stroke();

    let startAngle = -Math.PI / 2;
    const segments: { startAngle: number; endAngle: number }[] = [];

    // Drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(109, 62, 241, 0.25)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // Segments
    value.forEach((v, i) => {
      const sliceAngle = (v / total) * (Math.PI * 2 - gap * value.length);
      const segStart = startAngle + gap / 2;
      const segEnd = startAngle + sliceAngle;
      segments.push({ startAngle: segStart, endAngle: segEnd });

      const segColor = (colors[i] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]).bgColor;
      const isHovered = hover?.index === i;

      // Gradient per segment
      const midAngle = startAngle + sliceAngle / 2;
      const gx1 = cx + Math.cos(midAngle - 0.5) * outerR;
      const gy1 = cy + Math.sin(midAngle - 0.5) * outerR;
      const gx2 = cx + Math.cos(midAngle + 0.5) * outerR;
      const gy2 = cy + Math.sin(midAngle + 0.5) * outerR;
      const segGradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
      segGradient.addColorStop(0, segColor);
      segGradient.addColorStop(1, segColor + 'CC');

      // Hovered segment pops out
      const drawOuter = isHovered ? outerR + 6 : outerR;
      const drawInner = isHovered ? innerR - 2 : innerR;

      ctx.beginPath();
      ctx.arc(cx, cy, drawOuter, segStart, segEnd);
      ctx.arc(cx, cy, drawInner, segEnd, segStart, true);
      ctx.closePath();
      ctx.fillStyle = isHovered ? segColor : segGradient;
      ctx.fill();

      startAngle += sliceAngle + gap;
    });

    ctx.restore();
    segmentsRef.current = segments;

    // Center circle (clean dark fill)
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2);
    ctx.fillStyle = holeColor;
    ctx.fill();

    // Center text — show hovered label + pct, or nothing
    if (hover !== null) {
      const pct = Math.round((value[hover.index] / total) * 100);
      const label = labels?.[hover.index] || '';
      const segColor = (colors[hover.index] || DEFAULT_COLORS[hover.index % DEFAULT_COLORS.length]).bgColor;

      ctx.fillStyle = axisActiveColor;
      ctx.font = 'bold 28px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${pct}%`, cx, label ? cy - 8 : cy);

      if (label) {
        ctx.fillStyle = segColor;
        ctx.font = '13px Manrope, sans-serif';
        ctx.fillText(label, cx, cy + 18);
      }
    }

    // Legend
    if (hasLabelsLocal) {
      ctx.font = '11px Manrope, sans-serif';
      const legendY = actualDim - 10;

      let totalWidth = 0;
      labels!.forEach((label) => {
        totalWidth += 14 + ctx.measureText(label).width + 20;
      });
      totalWidth -= 20;

      let lx = (actualDim - totalWidth) / 2;

      labels!.forEach((label, i) => {
        const segColor = (colors[i] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]).bgColor;
        const markerSize = 8;
        ctx.beginPath();
        ctx.roundRect(lx, legendY - markerSize / 2 - 2, markerSize, markerSize, 2);
        ctx.fillStyle = segColor;
        ctx.fill();

        ctx.fillStyle = hover?.index === i ? axisActiveColor : mutedColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + 14, legendY - 2);
        lx += 14 + ctx.measureText(label).width + 20;
      });
    }
  }, [value, colors, DEFAULT_COLORS, labels, hover, size, total, maxDim, gridColor, holeColor, axisActiveColor, mutedColor]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const { cx, cy, innerR, outerR } = layoutRef.current;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < innerR || dist > outerR + 8) {
        if (hover !== null) setHover(null);
        return;
      }

      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += Math.PI * 2;

      const segments = segmentsRef.current;
      for (let i = 0; i < segments.length; i++) {
        let { startAngle, endAngle } = segments[i];
        // Normalize angles
        if (startAngle < -Math.PI / 2) startAngle += Math.PI * 2;
        if (endAngle < -Math.PI / 2) endAngle += Math.PI * 2;

        if (angle >= startAngle && angle <= endAngle) {
          if (hover?.index !== i) {
            setHover({ index: i, x: e.clientX - rect.left, y: e.clientY - rect.top });
          }
          return;
        }
      }

      if (hover !== null) setHover(null);
    },
    [hover],
  );

  const handleMouseLeave = useCallback(() => {
    setHover(null);
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const hoveredPct = hover !== null ? Math.round((value[hover.index] / total) * 100) : 0;
  const hoveredLabel = hover !== null && labels ? labels[hover.index] : '';
  const hoveredColor =
    hover !== null
      ? (colors[hover.index] || DEFAULT_COLORS[hover.index % DEFAULT_COLORS.length]).bgColor
      : '';

  return (
    <div
      data-tid="DonutChart"
      style={{ position: 'relative', width: '100%', maxWidth: `${maxDim}px`, aspectRatio: '1' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hover !== null && (
        <div
          style={{
            position: 'absolute',
            left: hover.x,
            top: hover.y - 52,
            transform: 'translateX(-50%)',
            background: 'var(--color-bg-secondary)',
            border: `1px solid ${hoveredColor}`,
            borderRadius: '8px',
            padding: '8px 14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 16px ${hoveredColor}40`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              color: 'var(--color-fg-primary)',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'Manrope, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: hoveredColor,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            {hoveredLabel && <span style={{ color: 'var(--color-fg-secondary)' }}>{hoveredLabel}:</span>}
            <span>{hoveredPct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonutChart;
