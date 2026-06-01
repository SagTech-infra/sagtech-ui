'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as tokens from '@/tokens/tokens';
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
  const { colors } = useThemeColors();
  const { locale } = useLocale();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height - 16;
    const ringWidth = 14;
    const radius = Math.min(width / 2, height) - ringWidth - 8;

    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;
    const totalAngleSpan = endAngle - startAngle;

    const range = max - min || 1;
    const clamped = Math.max(min, Math.min(max, value));
    const valueAngle = startAngle + ((clamped - min) / range) * totalAngleSpan;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = ringWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Threshold zones — render bands behind the value arc.
    if (thresholds && thresholds.length) {
      const sorted = [...thresholds].sort((a, b) => a.value - b.value);
      let prev = min;
      sorted.forEach((t) => {
        const segStart = startAngle + ((prev - min) / range) * totalAngleSpan;
        const segEnd = startAngle + ((Math.min(t.value, max) - min) / range) * totalAngleSpan;
        if (segEnd > segStart) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, segStart, segEnd);
          ctx.strokeStyle = t.color + '40';
          ctx.lineWidth = ringWidth;
          ctx.stroke();
        }
        prev = t.value;
      });
    }

    // Value arc with gradient
    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    grad.addColorStop(0, colors.pr_purple);
    grad.addColorStop(1, colors.sec_purple);

    // Determine current zone color (if thresholds defined and value falls within one)
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

    ctx.save();
    ctx.shadowColor = (activeColor ?? colors.pr_purple) + '90';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, valueAngle);
    ctx.strokeStyle = activeColor ?? grad;
    ctx.lineWidth = ringWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Center text
    if (showValue) {
      ctx.fillStyle = tokens.colors.white_4;
      ctx.font = 'bold 28px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(new Intl.NumberFormat(locale).format(Math.round(clamped)), cx, cy - 14);
    }

    if (label) {
      ctx.fillStyle = tokens.colors.grey_3;
      ctx.font = '12px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, cx, cy + 4);
    }

    // Min/max ticks
    if (showRange) {
      ctx.fillStyle = tokens.colors.grey_2;
      ctx.font = '10px Manrope, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(new Intl.NumberFormat(locale).format(min), cx - radius - 4, cy + 6);
      ctx.textAlign = 'right';
      ctx.fillText(new Intl.NumberFormat(locale).format(max), cx + radius + 4, cy + 6);
    }
  }, [value, min, max, thresholds, label, width, height, showValue, showRange, colors, locale]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
      }}
    />
  );
}

export default GaugeChart;
