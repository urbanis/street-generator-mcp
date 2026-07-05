import { describe, it, expect } from "vitest";
import { computeLayout, SKY_MIN } from "./layout.js";
import type { StreetConfig } from "./types.js";

let n = 0;
const street = (...w: number[]): StreetConfig => ({
  id: "s",
  name: "t",
  elements: w.map((width_m) => ({ id: `e${n++}`, type: "TRAFFIC_LANE", side: "LEFT", width_m })),
});

describe("computeLayout", () => {
  it("returns an empty layout for a zero-width street", () => {
    const l = computeLayout({ id: "s", name: "t", elements: [] });
    expect(l.totalWidthPx).toBe(0);
    expect(l.skyH).toBe(SKY_MIN);
  });

  it("places elements left to right and sums their pixel widths", () => {
    const l = computeLayout(street(3, 3));
    expect(l.elements[0].x).toBe(0);
    expect(l.elements[1].x).toBe(l.elements[0].widthPx);
    expect(l.totalWidthPx).toBeCloseTo(l.elements[0].widthPx + l.elements[1].widthPx);
  });

  it("clamps scale to at least MIN_SCALE (20) for a very wide street", () => {
    const l = computeLayout(street(100)); // 900/100 = 9 → clamped up to 20
    expect(l.scale).toBe(20);
  });
});
