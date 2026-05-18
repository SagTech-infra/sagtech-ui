"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import useWindowSize from "@/hooks/useWindowSize";

export interface ParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
  quantity?: number;
  color?: string;
  velocity?: number;
  staticity?: number;
  size?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function resolveColor(raw: string, canvas: HTMLCanvasElement): string {
  if (!raw.startsWith("var(")) return raw;
  // Extract CSS variable name from var(--foo) or var(--foo, fallback)
  const match = raw.match(/var\(\s*(--[^,)]+)/);
  if (!match) return raw;
  const propName = match[1].trim();
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(propName)
    .trim();
  // Use a temp canvas pixel to resolve further if it's still a color keyword
  if (resolved) return resolved;
  // Fallback: try setting fillStyle on a temp context
  const tmpCtx = canvas.getContext("2d");
  if (!tmpCtx) return "#a855f7"; // fallback purple
  tmpCtx.fillStyle = raw;
  return tmpCtx.fillStyle;
}

function createParticle(width: number, height: number, size: number): Particle {
  const radius = size * (1 + Math.random() * 2); // size × 1..3
  const speed = 0.2 + Math.random() * 0.6;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    opacity: 0.3 + Math.random() * 0.7,
  };
}

const Particles = forwardRef<HTMLDivElement, ParticlesProps>(
  (
    {
      quantity = 50,
      color = "var(--color-sec_purple)",
      velocity = 0.5,
      staticity: _staticity = 50,
      size = 0.4,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number | null>(null);
    const resolvedColorRef = useRef<string | null>(null);
    const windowSize = useWindowSize();

    const [intersectionRef, isVisible] = useIntersectionObserver({
      threshold: 0,
    });

    // Merge intersection + forwarded refs onto the wrapper div
    const setWrapperRef = useCallback(
      (node: HTMLDivElement | null) => {
        (
          intersectionRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [forwardedRef],
    );

    // Initialise / resize canvas and particles
    useEffect(() => {
      if (prefersReducedMotion) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      resolvedColorRef.current = resolveColor(color, canvas);
      particlesRef.current = Array.from({ length: quantity }, () =>
        createParticle(w, h, size),
      );
    }, [prefersReducedMotion, quantity, color, size, windowSize]);

    // Animation loop
    useEffect(() => {
      if (prefersReducedMotion) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const loop = () => {
        ctx.clearRect(0, 0, w, h);

        const fillColor = resolvedColorRef.current ?? "#a855f7";
        const speedScale = velocity;

        for (const p of particlesRef.current) {
          // Update position
          p.x += p.vx * speedScale;
          p.y += p.vy * speedScale;

          // Wrap edges
          if (p.x < -p.radius) p.x = w + p.radius;
          else if (p.x > w + p.radius) p.x = -p.radius;
          if (p.y < -p.radius) p.y = h + p.radius;
          else if (p.y > h + p.radius) p.y = -p.radius;

          // Draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = fillColor;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        rafRef.current = requestAnimationFrame(loop);
      };

      if (isVisible) {
        rafRef.current = requestAnimationFrame(loop);
      }

      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }, [prefersReducedMotion, isVisible, velocity, windowSize]);

    if (prefersReducedMotion) {
      return (
        <div
          ref={setWrapperRef}
          style={{ position: "relative", ...style }}
          {...rest}
        />
      );
    }

    return (
      <div
        ref={setWrapperRef}
        style={{ position: "relative", ...style }}
        {...rest}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
      </div>
    );
  },
);

Particles.displayName = "Particles";
export default Particles;
