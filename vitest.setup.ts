import "@testing-library/jest-dom/vitest";
import { vi, expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// jest-axe accessibility matcher — used by src/__tests__/a11y.test.tsx.
expect.extend(toHaveNoViolations);

// framer-motion's exit animations rely on transitionend events that
// happy-dom does not fire reliably, which leaves elements stuck in the
// DOM during tests. Swap the library for transparent pass-through
// primitives so assertions reflect the logical state, not in-flight
// animation frames.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

  const passthrough =
    (tag: keyof HTMLElementTagNameMap) => (props: AnyProps) => {
      const {
        initial: _i,
        animate: _a,
        exit: _e,
        transition: _t,
        variants: _v,
        whileHover: _wh,
        whileTap: _wt,
        whileFocus: _wf,
        whileDrag: _wd,
        whileInView: _wi,
        layout: _l,
        layoutId: _lid,
        drag: _d,
        dragConstraints: _dc,
        onAnimationStart: _onS,
        onAnimationComplete: _onC,
        ...rest
      } = props;
      return React.createElement(tag, rest);
    };

  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        passthrough(prop as keyof HTMLElementTagNameMap),
    },
  );

  const AnimatePresence = ({ children }: AnyProps) =>
    React.createElement(React.Fragment, null, children);

  // Return false so components animate normally in tests; individual tests
  // that need the reduced-motion path can override this with vi.spyOn.
  const useReducedMotion = () => false;

  return { motion, AnimatePresence, useReducedMotion };
});

// ---------------------------------------------------------------------------
// IntersectionObserver / ResizeObserver — happy-dom omits both; needed by
// @tanstack/react-virtual (VirtualList) and @xyflow/react (VisualGraphEditor).
// ---------------------------------------------------------------------------
class IntersectionObserverStub {
  constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
  observe(_el: Element): void {}
  unobserve(_el: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

class ResizeObserverStub {
  constructor(_cb: ResizeObserverCallback) {}
  observe(_el: Element, _opts?: ResizeObserverOptions): void {}
  unobserve(_el: Element): void {}
  disconnect(): void {}
}

globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver =
  ResizeObserverStub as unknown as typeof ResizeObserver;

// ---------------------------------------------------------------------------
// Canvas 2D context — happy-dom returns null for getContext('2d'); the chart
// components call canvas methods that would throw.  Provide a no-op surface.
// ---------------------------------------------------------------------------
const noopGradient = { addColorStop(): void {} };
const noopPattern = {};

const canvas2DContextStub: Partial<CanvasRenderingContext2D> = {
  // Drawing rectangles
  fillRect(): void {},
  clearRect(): void {},
  // Path methods
  beginPath(): void {},
  moveTo(): void {},
  lineTo(): void {},
  arc(): void {},
  arcTo(): void {},
  ellipse(): void {},
  bezierCurveTo(): void {},
  quadraticCurveTo(): void {},
  rect(): void {},
  closePath(): void {},
  // State
  save(): void {},
  restore(): void {},
  // Transforms
  translate(): void {},
  scale(): void {},
  rotate(): void {},
  setTransform(): void {},
  // Clip
  clip(): void {},
  // Fill / stroke
  fill(): void {},
  stroke(): void {},
  // Dash
  setLineDash(): void {},
  // Text
  measureText(): TextMetrics { return { width: 0 } as TextMetrics; },
  fillText(): void {},
  strokeText(): void {},
  // Image data
  getImageData(): ImageData { return { data: [] } as unknown as ImageData; },
  putImageData(): void {},
  drawImage(): void {},
  // Gradients / patterns
  createLinearGradient(): CanvasGradient { return noopGradient as unknown as CanvasGradient; },
  createRadialGradient(): CanvasGradient { return noopGradient as unknown as CanvasGradient; },
  createPattern(): CanvasPattern { return noopPattern as unknown as CanvasPattern; },
};

// Settable style props — allow assignment without throwing.
const styleProps = [
  "fillStyle",
  "strokeStyle",
  "lineWidth",
  "font",
  "globalAlpha",
  "textAlign",
  "textBaseline",
  "lineCap",
  "lineJoin",
  "shadowBlur",
  "shadowColor",
  "miterLimit",
  "lineDashOffset",
] as const;

styleProps.forEach((prop) => {
  Object.defineProperty(canvas2DContextStub, prop, {
    get() { return ""; },
    set(_v: unknown) {},
    configurable: true,
  });
});

// Patch HTMLCanvasElement.prototype.getContext to return the stub for '2d'.
// We keep the original so other getContext variants still fall through.
const _origGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function patchedGetContext(
  contextId: string,
  ...rest: unknown[]
) {
  if (contextId === "2d") {
    return canvas2DContextStub as unknown as CanvasRenderingContext2D;
  }
  return (_origGetContext as (id: string, ...a: unknown[]) => unknown).call(
    this,
    contextId,
    ...rest,
  );
} as typeof HTMLCanvasElement.prototype.getContext;

// GaugeChart reads window.devicePixelRatio; happy-dom may leave it undefined.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "devicePixelRatio", {
    value: 1,
    writable: true,
    configurable: true,
  });
}

// ---------------------------------------------------------------------------
// 3D library mocks — applied globally so any test file that imports (directly
// or transitively) the 3D components does not attempt WebGL calls in happy-dom.
// ---------------------------------------------------------------------------

// @react-three/fiber
vi.mock("@react-three/fiber", async () => {
  const React = await import("react");
  const Canvas = ({ "data-testid": dtid }: { "data-testid"?: string }) =>
    React.createElement("div", { "data-testid": dtid ?? "r3f-canvas" });
  const useFrame = (): void => {};
  const useThree = (): Record<string, never> => ({});
  const extend = (): void => {};
  return { Canvas, useFrame, useThree, extend };
});

// @react-three/drei
vi.mock("@react-three/drei", async () => {
  const React = await import("react");
  type ChildrenProps = { children?: React.ReactNode };

  // Html renders children so that label content remains in the DOM for queries.
  const Html = ({ children }: ChildrenProps) =>
    React.createElement("div", null, children);

  // Everything else renders null — they are purely visual 3D primitives.
  const nullComponent = (): null => null;

  const useGLTF = (): Record<string, never> => ({});

  return {
    OrbitControls: nullComponent,
    Html,
    Stars: nullComponent,
    Sphere: nullComponent,
    Line: nullComponent,
    Text: nullComponent,
    Billboard: nullComponent,
    useGLTF,
    Environment: nullComponent,
    PerspectiveCamera: nullComponent,
  };
});

// three — provide a Proxy so any named import resolves to a constructable
// no-op class.  The 3D components reference Color, Vector3, geometries, etc.
vi.mock("three", () => {
  class NoopClass {
    // Allow arbitrary property access / method calls on instances.
    [key: string]: unknown;
  }
  const NoopClassProxy = new Proxy(NoopClass, {
    construct(Target, _args) {
      return new Proxy(new Target(), {
        get(_t, p) {
          if (p in _t) return (_t as Record<string | symbol, unknown>)[p];
          return (): void => {};
        },
        set(_t, p, v) {
          (_t as Record<string | symbol, unknown>)[p] = v;
          return true;
        },
      });
    },
  });

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "__esModule") return true;
        return NoopClassProxy;
      },
    },
  );
});

// react-force-graph-3d — default export is the ForceGraph component.
vi.mock("react-force-graph-3d", async () => {
  const React = await import("react");
  const ForceGraph3D = ({ "data-testid": dtid }: { "data-testid"?: string }) =>
    React.createElement("div", { "data-testid": dtid ?? "force-graph-3d" });
  return { default: ForceGraph3D };
});
