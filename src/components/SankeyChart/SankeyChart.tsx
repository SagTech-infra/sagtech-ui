'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as tokens from '@/tokens/tokens';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { SankeyChartProps, SankeyLink } from './types';

interface NodeLayout {
  id: string;
  label: string;
  column: number;
  x: number;
  y: number;
  w: number;
  h: number;
  totalIn: number;
  totalOut: number;
  color: string;
}

interface LinkLayout {
  source: string;
  target: string;
  value: number;
  sx: number;
  sy0: number;
  sy1: number;
  tx: number;
  ty0: number;
  ty1: number;
  color: string;
}

interface HoverState {
  type: 'node' | 'link';
  id: string; // node id, or "source>target"
  x: number;
  y: number;
}

// Topological-ish column assignment via longest-path-from-source.
function assignColumns(nodes: { id: string }[], links: SankeyLink[]): Record<string, number> {
  const incoming: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};
  nodes.forEach((n) => {
    incoming[n.id] = [];
    outgoing[n.id] = [];
  });
  links.forEach((l) => {
    if (incoming[l.target] && outgoing[l.source]) {
      incoming[l.target].push(l.source);
      outgoing[l.source].push(l.target);
    }
  });

  const columns: Record<string, number> = {};
  // BFS from sources (nodes with no incoming links)
  const queue: { id: string; col: number }[] = nodes
    .filter((n) => incoming[n.id].length === 0)
    .map((n) => ({ id: n.id, col: 0 }));
  // Fallback if all nodes are part of cycles: seed with first node
  if (queue.length === 0 && nodes.length) {
    queue.push({ id: nodes[0].id, col: 0 });
  }

  while (queue.length) {
    const { id, col } = queue.shift()!;
    if (columns[id] !== undefined && columns[id] >= col) continue;
    columns[id] = col;
    outgoing[id]?.forEach((tgt) => {
      queue.push({ id: tgt, col: col + 1 });
    });
  }

  // Any node not reached: place at column 0
  nodes.forEach((n) => {
    if (columns[n.id] === undefined) columns[n.id] = 0;
  });

  return columns;
}

function SankeyChart({ nodes, links, width = '100%', height = 400 }: SankeyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const { palette: PALETTE } = useThemeColors();
  const layoutRef = useRef<{ nodes: NodeLayout[]; links: LinkLayout[] } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nodes?.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const labelPad = Math.max(60, Math.min(100, w * 0.2));
    const padding = { top: 16, right: labelPad, bottom: 16, left: labelPad };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const columns = assignColumns(nodes, links);
    const maxCol = Math.max(0, ...Object.values(columns));
    const colCount = maxCol + 1;

    // Group nodes by column and compute totals
    const byColumn: NodeLayout[][] = Array.from({ length: colCount }, () => []);
    const nodeMap: Record<string, NodeLayout> = {};

    nodes.forEach((n, i) => {
      const col = columns[n.id];
      const totalIn = links
        .filter((l) => l.target === n.id)
        .reduce((acc, l) => acc + l.value, 0);
      const totalOut = links
        .filter((l) => l.source === n.id)
        .reduce((acc, l) => acc + l.value, 0);
      const layout: NodeLayout = {
        id: n.id,
        label: n.label,
        column: col,
        x: 0,
        y: 0,
        w: 14,
        h: 0,
        totalIn,
        totalOut,
        color: PALETTE[i % PALETTE.length],
      };
      byColumn[col].push(layout);
      nodeMap[n.id] = layout;
    });

    // Compute per-column max value for vertical scaling
    let maxColValue = 0;
    byColumn.forEach((col) => {
      const colTotal = col.reduce((acc, n) => acc + Math.max(n.totalIn, n.totalOut, 1), 0);
      if (colTotal > maxColValue) maxColValue = colTotal;
    });
    if (!maxColValue) maxColValue = 1;

    const nodeGap = 8;
    const colXStep = colCount > 1 ? chartW / (colCount - 1) : 0;
    const pixelsPerUnit = (chartH - nodeGap * 4) / maxColValue;

    // Place nodes within each column, sorted by total (largest first)
    byColumn.forEach((col, ci) => {
      col.sort((a, b) => Math.max(b.totalIn, b.totalOut) - Math.max(a.totalIn, a.totalOut));
      const totalH = col.reduce(
        (acc, n) => acc + Math.max(n.totalIn, n.totalOut, 1) * pixelsPerUnit,
        0,
      );
      const totalGap = (col.length - 1) * nodeGap;
      let y = padding.top + (chartH - totalH - totalGap) / 2;
      const x = padding.left + colXStep * ci;
      col.forEach((n) => {
        n.x = x - n.w / 2;
        n.y = y;
        n.h = Math.max(Math.max(n.totalIn, n.totalOut, 1) * pixelsPerUnit, 4);
        y += n.h + nodeGap;
      });
    });

    // Compute link endpoints. Track running offset within source/target so
    // multiple links stack along the node height.
    const sourceOffsets: Record<string, number> = {};
    const targetOffsets: Record<string, number> = {};
    const linkLayouts: LinkLayout[] = [];

    links.forEach((l) => {
      const s = nodeMap[l.source];
      const t = nodeMap[l.target];
      if (!s || !t) return;
      const sScale = s.totalOut > 0 ? s.h / s.totalOut : 0;
      const tScale = t.totalIn > 0 ? t.h / t.totalIn : 0;
      const sH = l.value * sScale;
      const tH = l.value * tScale;
      const sOff = sourceOffsets[s.id] ?? 0;
      const tOff = targetOffsets[t.id] ?? 0;

      const sx = s.x + s.w;
      const sy0 = s.y + sOff;
      const sy1 = sy0 + sH;
      const tx = t.x;
      const ty0 = t.y + tOff;
      const ty1 = ty0 + tH;

      sourceOffsets[s.id] = sOff + sH;
      targetOffsets[t.id] = tOff + tH;

      linkLayouts.push({
        source: l.source,
        target: l.target,
        value: l.value,
        sx,
        sy0,
        sy1,
        tx,
        ty0,
        ty1,
        color: s.color,
      });
    });

    // Draw links first (bezier curves), then nodes on top.
    linkLayouts.forEach((l) => {
      const isHovered =
        hover?.type === 'link' && hover.id === `${l.source}>${l.target}`;

      const cpX1 = l.sx + (l.tx - l.sx) * 0.5;
      const cpX2 = l.sx + (l.tx - l.sx) * 0.5;

      const grad = ctx.createLinearGradient(l.sx, 0, l.tx, 0);
      grad.addColorStop(0, l.color + (isHovered ? 'B0' : '50'));
      grad.addColorStop(1, (nodeMap[l.target]?.color ?? l.color) + (isHovered ? 'B0' : '50'));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(l.sx, l.sy0);
      ctx.bezierCurveTo(cpX1, l.sy0, cpX2, l.ty0, l.tx, l.ty0);
      ctx.lineTo(l.tx, l.ty1);
      ctx.bezierCurveTo(cpX2, l.ty1, cpX1, l.sy1, l.sx, l.sy1);
      ctx.closePath();
      ctx.fill();
    });

    // Draw nodes
    Object.values(nodeMap).forEach((n) => {
      const isHovered = hover?.type === 'node' && hover.id === n.id;
      ctx.save();
      if (isHovered) {
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 12;
      }
      ctx.fillStyle = n.color;
      const r = 3;
      ctx.beginPath();
      ctx.moveTo(n.x + r, n.y);
      ctx.lineTo(n.x + n.w - r, n.y);
      ctx.quadraticCurveTo(n.x + n.w, n.y, n.x + n.w, n.y + r);
      ctx.lineTo(n.x + n.w, n.y + n.h - r);
      ctx.quadraticCurveTo(n.x + n.w, n.y + n.h, n.x + n.w - r, n.y + n.h);
      ctx.lineTo(n.x + r, n.y + n.h);
      ctx.quadraticCurveTo(n.x, n.y + n.h, n.x, n.y + n.h - r);
      ctx.lineTo(n.x, n.y + r);
      ctx.quadraticCurveTo(n.x, n.y, n.x + r, n.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Label — left of column 0, right otherwise (use column index again)
      const labelLeft = n.column === 0;
      ctx.fillStyle = isHovered ? tokens.colors.white_4 : tokens.colors.grey_3;
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = labelLeft ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      const lx = labelLeft ? n.x - 8 : n.x + n.w + 8;
      const ly = n.y + n.h / 2;
      ctx.fillText(n.label, lx, ly);
    });

    layoutRef.current = { nodes: Object.values(nodeMap), links: linkLayouts };
  }, [nodes, links, hover, PALETTE]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const layout = layoutRef.current;
      if (!canvas || !layout) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Test nodes first
      for (const n of layout.nodes) {
        if (mx >= n.x && mx <= n.x + n.w && my >= n.y && my <= n.y + n.h) {
          if (hover?.type !== 'node' || hover?.id !== n.id) {
            setHover({ type: 'node', id: n.id, x: mx, y: my });
          }
          return;
        }
      }
      // Approximate link hit: x between sx and tx, y close to a linear interp.
      for (const l of layout.links) {
        if (mx < l.sx - 2 || mx > l.tx + 2) continue;
        const tt = (mx - l.sx) / Math.max(1, l.tx - l.sx);
        const yTop = l.sy0 + (l.ty0 - l.sy0) * tt;
        const yBot = l.sy1 + (l.ty1 - l.sy1) * tt;
        if (my >= yTop && my <= yBot) {
          const id = `${l.source}>${l.target}`;
          if (hover?.type !== 'link' || hover?.id !== id) {
            setHover({ type: 'link', id, x: mx, y: my });
          }
          return;
        }
      }
      if (hover !== null) setHover(null);
    },
    [hover],
  );

  const handleMouseLeave = useCallback(() => setHover(null), []);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  let tooltipText = '';
  if (hover && layoutRef.current) {
    if (hover.type === 'node') {
      const n = layoutRef.current.nodes.find((nn) => nn.id === hover.id);
      if (n)
        tooltipText = `${n.label} · in ${n.totalIn} / out ${n.totalOut}`;
    } else {
      const l = layoutRef.current.links.find(
        (ll) => `${ll.source}>${ll.target}` === hover.id,
      );
      if (l) tooltipText = `${l.source} → ${l.target} · ${l.value}`;
    }
  }

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
      {hover !== null && tooltipText && (
        <div
          style={{
            position: 'absolute',
            left: hover.x,
            top: hover.y - 36,
            transform: 'translateX(-50%)',
            background: tokens.colors.black_2,
            border: '1px solid rgba(109, 62, 241, 0.3)',
            borderRadius: '8px',
            padding: '6px 10px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            zIndex: 10,
            fontFamily: 'Manrope, sans-serif',
            fontSize: '12px',
            color: tokens.colors.white_4,
            fontWeight: 600,
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}

export default SankeyChart;
