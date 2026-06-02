'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  /** Show a faded gradient under the line. */
  showArea?: boolean;
}

function SparklineChart({
  data,
  width = 80,
  height = 24,
  tone = 'neutral',
  showArea = false,
}: SparklineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colors } = useThemeColors();
  const toneColor =
    tone === 'success'
      ? colors.success
      : tone === 'warning'
        ? colors.warning
        : tone === 'error'
          ? colors.error
          : colors.pr_purple;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const minV = Math.min(...data);
    const maxV = Math.max(...data);
    const range = maxV - minV || 1;
    const pad = 2;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    const points = data.map((v, i) => ({
      x: pad + (i / Math.max(data.length - 1, 1)) * innerW,
      y: pad + innerH - ((v - minV) / range) * innerH,
    }));

    const color = toneColor;

    if (showArea) {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, color + '55');
      grad.addColorStop(1, color + '00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.lineTo(points[points.length - 1].x, height - pad);
      ctx.lineTo(points[0].x, height - pad);
      ctx.closePath();
      ctx.fill();
    }

    // Stroke
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Last point dot
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [data, width, height, showArea, toneColor]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
}

export default SparklineChart;
