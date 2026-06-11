'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useLocale } from '@/providers/LocaleContext';
import type { GaugeChartProps } from './types';

function GaugeChart({
  value,
  min = 0,
  max = 100,
  thresholds,
  label,
  width = 200,
  height = 120,
  showValue = true,
  showRange = true,
}: GaugeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colors, ui } = useThemeColors();
  const { locale } = useLocale();

  const trackColor = ui['border-default'];
  const valueColor = ui['fg-primary'];
  const labelColor = ui['fg-secondary'];
  const tickColor = ui['fg-muted'];
  const holeColor = ui['bg-primary'];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width || width;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, height);

    const cx = w / 2;
    const ringWidth = 16;
    // Leave headroom below the arc for the min/max ticks and label.
    const cy = height - 28;
    const radius = Math.max(
      24,
      Math.min(w / 2 - ringWidth / 2 - 6, height - ringWidth - 32),
    );

    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;
    const totalAngleSpan = endAngle - startAngle;

    const range = max - min || 1;
    const clamped = Math.max(min, Math.min(max, value));
    const valueAngle = startAngle + ((clamped - min) / range) * totalAngleSpan;

    const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);

    // Background track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = ringWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Threshold zones — subtle bands behind the value arc.
    if (thresholds && thresholds.length) {
      const sorted = [...thresholds].sort((a, b) => a.value - b.value);
      let prev = min;
      sorted.forEach((t) => {
        const segStart = startAngle + ((prev - min) / range) * totalAngleSpan;
        const segEnd = startAngle + ((Math.min(t.value, max) - min) / range) * totalAngleSpan;
        if (segEnd > segStart) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, segStart, segEnd);
          ctx.strokeStyle = t.color + '2e';
          ctx.lineWidth = ringWidth;
          ctx.lineCap = 'butt';
          ctx.stroke();
        }
        prev = t.value;
      });
    }

    // Determine the current zone color (if thresholds defined).
    let activeColor: string | null = null;
    if (thresholds && thresholds.length) {
      const sorted = [...thresholds].sort((a, b) => a.value - b.value);
      for (const t of sorted) {
        if (clamped <= t.value) {
          activeColor = t.color;
          break;
        }
      }
      if (!activeColor) activeColor = sorted[sorted.length - 1].color;
    }

    // Value arc (gradient when no threshold zone is active) with a soft glow.
    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    grad.addColorStop(0, colors.pr_purple);
    grad.addColorStop(1, colors.sec_purple);

    ctx.save();
    ctx.shadowColor = (activeColor ?? colors.pr_purple) + '70';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, valueAngle);
    ctx.strokeStyle = activeColor ?? grad;
    ctx.lineWidth = ringWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Current-value marker: a hollow dot riding the arc tip.
    const tipX = cx + radius * Math.cos(valueAngle);
    const tipY = cy + radius * Math.sin(valueAngle);
    ctx.beginPath();
    ctx.arc(tipX, tipY, ringWidth / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = holeColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tipX, tipY, ringWidth / 2 - 2, 0, Math.PI * 2);
    ctx.strokeStyle = activeColor ?? colors.sec_purple;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center value, sitting in the bowl of the arc.
    const valueY = cy - radius * 0.34;
    if (showValue) {
      ctx.fillStyle = valueColor;
      ctx.font = 'bold 30px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(fmt(Math.round(clamped)), cx, valueY + 10);
    }

    if (label) {
      ctx.fillStyle = labelColor;
      ctx.font = '600 12px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, cx, valueY + 18);
    }

    // Min/max ticks centered under each end of the arc.
    if (showRange) {
      ctx.fillStyle = tickColor;
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(fmt(min), cx - radius, cy + 8);
      ctx.fillText(fmt(max), cx + radius, cy + 8);
    }
  }, [value, min, max, thresholds, label, width, height, showValue, showRange, colors, locale, trackColor, valueColor, labelColor, tickColor, holeColor]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: `${width}px` }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'block',
        }}
      />
    </div>
  );
}

export default GaugeChart;
