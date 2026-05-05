'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import type { TreemapChartProps, TreemapNode } from './types';

const PALETTE = [
  tokens.colors.pr_purple,
  tokens.colors.sec_purple,
  tokens.colors.success,
  tokens.colors.warning,
  tokens.colors.sec_blue,
];

interface TreemapRect {
  node: TreemapNode;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

interface HoverState {
  id: string;
  x: number;
  y: number;
}

// Squarified treemap layout. Returns flat list of rectangles for the leaves
// of the input tree. Children inherit their parent's color (lightened slightly
// when nested too deeply, here we just keep parent palette).
function squarify(
  nodes: TreemapNode[],
  x: number,
  y: number,
  w: number,
  h: number,
  baseColor: string,
  depth: number,
  pad: number,
  out: TreemapRect[],
) {
  if (!nodes.length || w <= 0 || h <= 0) return;
  const total = nodes.reduce((acc, n) => acc + n.value, 0);
  if (total <= 0) return;

  // Build a list with computed area per node within this region.
  const items = nodes
    .filter((n) => n.value > 0)
    .map((n) => ({ node: n, area: (n.value / total) * (w * h) }));

  if (!items.length) return;

  let cx = x;
  let cy = y;
  let cw = w;
  let ch = h;
  let row: typeof items = [];
  let i = 0;

  function worst(row: typeof items, side: number): number {
    if (!row.length) return Infinity;
    const sum = row.reduce((acc, r) => acc + r.area, 0);
    let max = -Infinity;
    let min = Infinity;
    row.forEach((r) => {
      if (r.area > max) max = r.area;
      if (r.area < min) min = r.area;
    });
    const s2 = sum * sum;
    return Math.max((side * side * max) / s2, s2 / (side * side * min));
  }

  function layoutRow(row: typeof items, side: number, horizontal: boolean) {
    const sum = row.reduce((acc, r) => acc + r.area, 0);
    const thickness = sum / side;
    let offset = horizontal ? cx : cy;
    row.forEach((r) => {
      const length = r.area / thickness;
      const rx = horizontal ? offset : cx;
      const ry = horizontal ? cy : offset;
      const rw = horizontal ? length : thickness;
      const rh = horizontal ? thickness : length;

      // Build child color (rotate palette so siblings differ a bit).
      const idx = out.length % PALETTE.length;
      const color =
        depth === 0
          ? r.node.color ?? PALETTE[idx]
          : r.node.color ?? baseColor;

      if (r.node.children && r.node.children.length) {
        squarify(
          r.node.children,
          rx + pad,
          ry + pad,
          Math.max(0, rw - pad * 2),
          Math.max(0, rh - pad * 2),
          color,
          depth + 1,
          pad,
          out,
        );
      } else {
        out.push({ node: r.node, x: rx + pad / 2, y: ry + pad / 2, w: Math.max(0, rw - pad), h: Math.max(0, rh - pad), color });
      }

      offset += length;
    });

    if (horizontal) {
      cy += thickness;
      ch -= thickness;
    } else {
      cx += thickness;
      cw -= thickness;
    }
  }

  while (i < items.length) {
    const item = items[i];
    const horizontal = cw <= ch; // narrow side first
    const side = horizontal ? cw : ch;
    const candidate = [...row, item];

    if (worst(row, side) >= worst(candidate, side)) {
      row.push(item);
      i++;
    } else {
      layoutRow(row, side, horizontal);
      row = [];
    }
  }
  if (row.length) {
    const horizontal = cw <= ch;
    const side = horizontal ? cw : ch;
    layoutRow(row, side, horizontal);
  }
}

function TreemapChart({ data, width = '100%', height = 400, padding = 2 }: TreemapChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const rectsRef = useRef<TreemapRect[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;

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

    const out: TreemapRect[] = [];
    squarify(data, 0, 0, w, h, PALETTE[0], 0, padding, out);
    rectsRef.current = out;

    out.forEach((r) => {
      const isHovered = hover?.id === r.node.id;
      ctx.save();
      if (isHovered) {
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 12;
      }

      const grad = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
      grad.addColorStop(0, r.color);
      grad.addColorStop(1, r.color + 'A0');
      ctx.fillStyle = grad;

      const rad = 4;
      const rr = Math.min(rad, r.w / 2, r.h / 2);
      ctx.beginPath();
      ctx.moveTo(r.x + rr, r.y);
      ctx.lineTo(r.x + r.w - rr, r.y);
      ctx.quadraticCurveTo(r.x + r.w, r.y, r.x + r.w, r.y + rr);
      ctx.lineTo(r.x + r.w, r.y + r.h - rr);
      ctx.quadraticCurveTo(r.x + r.w, r.y + r.h, r.x + r.w - rr, r.y + r.h);
      ctx.lineTo(r.x + rr, r.y + r.h);
      ctx.quadraticCurveTo(r.x, r.y + r.h, r.x, r.y + r.h - rr);
      ctx.lineTo(r.x, r.y + rr);
      ctx.quadraticCurveTo(r.x, r.y, r.x + rr, r.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Label only if rect is large enough
      if (r.w > 48 && r.h > 22) {
        ctx.fillStyle = tokens.colors.white_4;
        ctx.font = 'bold 12px Manrope, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(r.node.label, r.x + 6, r.y + 6);
        if (r.h > 38) {
          ctx.fillStyle = tokens.colors.white_2;
          ctx.font = '11px Manrope, sans-serif';
          ctx.fillText(String(r.node.value), r.x + 6, r.y + 22);
        }
      }
    });
  }, [data, hover, padding]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const found = rectsRef.current.find(
        (r) => mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h,
      );
      if (found) {
        if (hover?.id !== found.node.id) {
          setHover({ id: found.node.id, x: mx, y: my });
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

  const hovered =
    hover !== null ? rectsRef.current.find((r) => r.node.id === hover.id) : null;

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
      {hovered && hover && (
        <div
          style={{
            position: 'absolute',
            left: hover.x,
            top: hover.y - 56,
            transform: 'translateX(-50%)',
            background: tokens.colors.black_2,
            border: `1px solid ${hovered.color}80`,
            borderRadius: '10px',
            padding: '8px 14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 16px ${hovered.color}40`,
            zIndex: 10,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <div style={{ fontSize: '12px', color: tokens.colors.grey_3, fontWeight: 600 }}>
            {hovered.node.label}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: tokens.colors.white_4,
              fontWeight: 700,
              marginTop: '2px',
            }}
          >
            {hovered.node.value}
          </div>
        </div>
      )}
    </div>
  );
}

export default TreemapChart;
