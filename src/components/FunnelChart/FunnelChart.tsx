'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import type { FunnelChartProps } from './types';

const PALETTE = [
  tokens.colors.pr_purple,
  tokens.colors.sec_purple,
  tokens.colors.success,
  tokens.colors.warning,
  tokens.colors.sec_blue,
];

interface HoverState {
  index: number;
  x: number;
  y: number;
}

interface StageRect {
  // Trapezoid corners in canvas coords. For vertical: top wider, bottom narrower.
  // For horizontal: left taller, right shorter.
  poly: { x: number; y: number }[];
  index: number;
}

function pointInPolygon(px: number, py: number, poly: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi || 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function FunnelChart({
  stages,
  width = '100%',
  height = 350,
  orientation = 'vertical',
  showPercents = true,
}: FunnelChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const stageRectsRef = useRef<StageRect[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stages?.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const maxV = Math.max(...stages.map((s) => s.value)) || 1;
    const isVertical = orientation === 'vertical';
    const padding = isVertical ? { top: 16, right: 16, bottom: 16, left: 16 } : { top: 24, right: 120, bottom: 24, left: 120 };
    const stageRects: StageRect[] = [];

    if (isVertical) {
      const usableW = w - padding.left - padding.right;
      const usableH = h - padding.top - padding.bottom;
      const stageH = usableH / stages.length;
      const gap = 4;

      stages.forEach((s, i) => {
        const fromV = s.value;
        const toV = stages[i + 1]?.value ?? s.value;
        const fromW = (fromV / maxV) * usableW;
        const toW = (toV / maxV) * usableW;
        const cx = padding.left + usableW / 2;

        const top = padding.top + stageH * i + gap / 2;
        const bottom = top + stageH - gap;
        const color = s.color ?? PALETTE[i % PALETTE.length];

        const poly = [
          { x: cx - fromW / 2, y: top },
          { x: cx + fromW / 2, y: top },
          { x: cx + toW / 2, y: bottom },
          { x: cx - toW / 2, y: bottom },
        ];

        const isHovered = hover?.index === i;
        const grad = ctx.createLinearGradient(cx - fromW / 2, top, cx + fromW / 2, top);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + 'B0');

        ctx.save();
        if (isHovered) {
          ctx.shadowColor = color + '80';
          ctx.shadowBlur = 12;
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        poly.forEach((p, pi) => {
          if (pi === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Label
        ctx.fillStyle = tokens.colors.white_4;
        ctx.font = 'bold 13px Manrope, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${s.label} · ${s.value}`, cx, (top + bottom) / 2);

        // Percent annotation between this and next stage
        if (showPercents && i < stages.length - 1) {
          const nextV = stages[i + 1].value;
          const pct = Math.round((nextV / fromV) * 100);
          ctx.fillStyle = tokens.colors.grey_3;
          ctx.font = '11px Manrope, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${pct}%`, cx + fromW / 2 + 8, bottom);
        }

        stageRects.push({ poly, index: i });
      });
    } else {
      const usableW = w - padding.left - padding.right;
      const usableH = h - padding.top - padding.bottom;
      const stageW = usableW / stages.length;
      const gap = 4;
      const cy = padding.top + usableH / 2;

      stages.forEach((s, i) => {
        const fromV = s.value;
        const toV = stages[i + 1]?.value ?? s.value;
        const fromH = (fromV / maxV) * usableH;
        const toH = (toV / maxV) * usableH;

        const left = padding.left + stageW * i + gap / 2;
        const right = left + stageW - gap;
        const color = s.color ?? PALETTE[i % PALETTE.length];

        const poly = [
          { x: left, y: cy - fromH / 2 },
          { x: right, y: cy - toH / 2 },
          { x: right, y: cy + toH / 2 },
          { x: left, y: cy + fromH / 2 },
        ];

        const isHovered = hover?.index === i;
        const grad = ctx.createLinearGradient(left, cy, right, cy);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + 'B0');

        ctx.save();
        if (isHovered) {
          ctx.shadowColor = color + '80';
          ctx.shadowBlur = 12;
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        poly.forEach((p, pi) => {
          if (pi === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = tokens.colors.white_4;
        ctx.font = 'bold 12px Manrope, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${s.label}`, (left + right) / 2, cy - 6);
        ctx.fillStyle = tokens.colors.grey_3;
        ctx.font = '11px Manrope, sans-serif';
        ctx.fillText(String(s.value), (left + right) / 2, cy + 10);

        if (showPercents && i < stages.length - 1) {
          const pct = Math.round((stages[i + 1].value / fromV) * 100);
          ctx.fillStyle = tokens.colors.grey_3;
          ctx.font = '11px Manrope, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${pct}%`, right, cy + fromH / 2 + 14);
        }

        stageRects.push({ poly, index: i });
      });
    }

    stageRectsRef.current = stageRects;
  }, [stages, hover, orientation, showPercents]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const found = stageRectsRef.current.find((s) => pointInPolygon(mx, my, s.poly));
      if (found) {
        if (hover?.index !== found.index) {
          setHover({ index: found.index, x: mx, y: my });
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

  const tooltipStage = hover !== null ? stages[hover.index] : null;
  const tooltipColor =
    tooltipStage?.color ?? PALETTE[(hover?.index ?? 0) % PALETTE.length];

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: typeof width === 'number' ? `${width}px` : width }}>
      <canvas
        ref={canvasRef}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: `${height}px`,
          display: 'block',
          cursor: 'pointer',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltipStage && hover !== null && (
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
            {tooltipStage.label}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: tokens.colors.white_4,
              fontWeight: 700,
              marginTop: '2px',
            }}
          >
            {tooltipStage.value}
          </div>
        </div>
      )}
    </div>
  );
}

export default FunnelChart;
