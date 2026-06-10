'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { RadarChartProps } from './types';

interface HoverState {
  axisIndex: number;
  x: number;
  y: number;
}

function alpha(hex: string, a: number): string {
  // Convert 0..1 to two-digit hex
  const aa = Math.max(0, Math.min(255, Math.round(a * 255))).toString(16).padStart(2, '0');
  return hex + aa;
}

function RadarChart({
  series,
  axes,
  width = '100%',
  height = 350,
  showGrid = true,
  fill = 0.3,
}: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { palette: COLORS, ui } = useThemeColors();
  const webColor = ui['border-default'];
  const axisColor = ui['fg-muted'];
  const axisActiveColor = ui['fg-primary'];
  const mutedColor = ui['fg-secondary'];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !axes.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2 - 12;
    const radius = Math.min(w, h) / 2 - 56;

    let maxV = 0;
    series.forEach((s) => {
      s.values.forEach((v) => {
        if (v > maxV) maxV = v;
      });
    });
    const maxY = Math.ceil(maxV / 10) * 10 || 100;

    ctx.clearRect(0, 0, w, h);

    const axisCount = axes.length;
    const angleStep = (Math.PI * 2) / axisCount;
    // Start from top
    const angleFor = (i: number) => -Math.PI / 2 + i * angleStep;

    if (showGrid) {
      // Concentric rings
      const rings = 5;
      for (let r = 1; r <= rings; r++) {
        const rr = (radius / rings) * r;
        ctx.strokeStyle = webColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < axisCount; i++) {
          const ang = angleFor(i);
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Spokes
      for (let i = 0; i < axisCount; i++) {
        const ang = angleFor(i);
        ctx.strokeStyle = webColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius);
        ctx.stroke();
      }
    }

    // Axis labels
    ctx.font = '12px Manrope, sans-serif';
    ctx.textBaseline = 'middle';
    axes.forEach((label, i) => {
      const ang = angleFor(i);
      const lx = cx + Math.cos(ang) * (radius + 18);
      const ly = cy + Math.sin(ang) * (radius + 18);
      const isHovered = hover?.axisIndex === i;
      ctx.fillStyle = isHovered ? axisActiveColor : axisColor;
      // Smart alignment based on quadrant
      const dx = Math.cos(ang);
      if (Math.abs(dx) < 0.2) ctx.textAlign = 'center';
      else if (dx > 0) ctx.textAlign = 'left';
      else ctx.textAlign = 'right';
      ctx.fillText(label, lx, ly);
    });

    // Series polygons
    series.forEach((s, si) => {
      const color = COLORS[si % COLORS.length];
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < axisCount; i++) {
        const v = s.values[i] ?? 0;
        const t = v / maxY;
        const ang = angleFor(i);
        const x = cx + Math.cos(ang) * radius * t;
        const y = cy + Math.sin(ang) * radius * t;
        points.push({ x, y });
      }

      // Fill
      ctx.fillStyle = alpha(color, fill);
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();

      // Stroke
      ctx.save();
      ctx.shadowColor = color + '60';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Vertices
      points.forEach((p, i) => {
        const isHovered = hover?.axisIndex === i;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    });

    // Legend
    if (series.length > 1) {
      ctx.font = '12px Manrope, sans-serif';
      let totalLegendW = 0;
      series.forEach((s) => {
        totalLegendW += 14 + ctx.measureText(s.name).width + 28;
      });
      totalLegendW -= 28;
      let lx = w / 2 - totalLegendW / 2;
      const ly = h - 14;
      series.forEach((s, si) => {
        const color = COLORS[si % COLORS.length];
        ctx.beginPath();
        ctx.arc(lx + 5, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = mutedColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.name, lx + 14, ly);
        lx += 14 + ctx.measureText(s.name).width + 28;
      });
    }
  }, [series, axes, hover, showGrid, fill, COLORS, webColor, axisColor, axisActiveColor, mutedColor]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !axes.length) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2 - 12;

      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.min(rect.width, rect.height) / 2 - 56;
      if (dist > radius + 24) {
        if (hover !== null) setHover(null);
        return;
      }

      let ang = Math.atan2(dy, dx) + Math.PI / 2; // shift so 0 is at top
      if (ang < 0) ang += Math.PI * 2;
      const idx = Math.round((ang / (Math.PI * 2)) * axes.length) % axes.length;
      if (hover?.axisIndex !== idx) {
        setHover({ axisIndex: idx, x: mx, y: my });
      }
    },
    [axes.length, hover],
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
          cursor: 'crosshair',
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
            background: 'var(--color-bg-secondary)',
            border: '1px solid rgba(109, 62, 241, 0.3)',
            borderRadius: '10px',
            padding: '8px 14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            zIndex: 10,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-fg-secondary)', fontWeight: 600 }}>
            {axes[hover.axisIndex]}
          </div>
          {series.map((s, si) => (
            <div
              key={s.name}
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
                  background: COLORS[si % COLORS.length],
                }}
              />
              <span style={{ color: 'var(--color-fg-secondary)' }}>{s.name}:</span>
              <span style={{ fontWeight: 700 }}>{s.values[hover.axisIndex] ?? 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RadarChart;
