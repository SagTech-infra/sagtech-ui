import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import * as framer from "framer-motion";
import { vi } from "vitest";
import { fadeIn, slideUp, scaleIn, popIn } from "../presets";
import { motionDurationS } from "@/utils/motion";
import { useMotionPreset } from "../useMotionPreset";

describe("motion presets", () => {
  it("fadeIn animates opacity only", () => {
    const v = fadeIn();
    expect(v.hidden).toMatchObject({ opacity: 0 });
    expect(v.visible).toMatchObject({ opacity: 1 });
    expect((v.visible as any).transition.duration).toBe(motionDurationS.normal);
  });

  it("slideUp uses the given distance on the y axis", () => {
    const v = slideUp({ distance: 16 });
    expect(v.hidden).toMatchObject({ opacity: 0, y: 16 });
    expect(v.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("slideUp defaults distance to 8", () => {
    expect(slideUp().hidden).toMatchObject({ y: 8 });
  });

  it("scaleIn scales up from <1", () => {
    const v = scaleIn();
    expect((v.hidden as any).scale).toBeLessThan(1);
    expect((v.visible as any).scale).toBe(1);
  });

  it("popIn scales from a smaller value than scaleIn", () => {
    expect((popIn().hidden as any).scale).toBeLessThan(
      (scaleIn().hidden as any).scale,
    );
  });

  it("respects a custom duration token name", () => {
    const v = fadeIn({ duration: "fast" });
    expect((v.visible as any).transition.duration).toBe(motionDurationS.fast);
  });
});

describe("useMotionPreset", () => {
  it("returns the named preset when motion is allowed", () => {
    vi.spyOn(framer, "useReducedMotion").mockReturnValue(false);
    const { result } = renderHook(() =>
      useMotionPreset("slideUp", { distance: 12 }),
    );
    expect(result.current.hidden).toMatchObject({ y: 12 });
  });

  it("returns an opacity-only, instant variant under reduced motion", () => {
    vi.spyOn(framer, "useReducedMotion").mockReturnValue(true);
    const { result } = renderHook(() => useMotionPreset("slideUp"));
    expect(result.current.hidden).toMatchObject({ opacity: 0 });
    expect(result.current.hidden).not.toHaveProperty("y");
    expect((result.current.visible as any).transition.duration).toBe(0);
  });
});
