import { describe, it, expect } from "vitest";
import { getDefaultFigureVariant, renderFigure } from "./figures.js";

describe("figures", () => {
  it("has a default pedestrian variant for sidewalks", () => {
    expect(getDefaultFigureVariant("SIDEWALK")).toBe("pedestrian-front");
  });

  it("has no figures for cycle lanes", () => {
    expect(getDefaultFigureVariant("CYCLE_LANE")).toBeUndefined();
  });

  it("renders an <image> with an inlined data-URI", () => {
    const out = renderFigure("pedestrian-front", 100, 200, 60, 30);
    expect(out).toContain("<image");
    expect(out).toContain("data:image/svg+xml");
  });

  it("returns empty string for an unknown variant", () => {
    expect(renderFigure("nope", 100, 200, 60, 30)).toBe("");
  });
});
