import { describe, it, expect } from "vitest";
import { getElementDef } from "./elements.js";

describe("getElementDef", () => {
  it("returns the sidewalk defaults", () => {
    const d = getElementDef("SIDEWALK");
    expect(d.defaultWidth_m).toBe(2.5);
    expect(d.fill).toBe("#f5f0e8");
    expect(d.stroke).toBe("#c8b89a");
  });

  it("returns a traffic lane default width", () => {
    expect(getElementDef("TRAFFIC_LANE").defaultWidth_m).toBe(3.25);
  });

  it("throws on an unknown type", () => {
    // @ts-expect-error deliberately invalid
    expect(() => getElementDef("NOPE")).toThrow();
  });
});
