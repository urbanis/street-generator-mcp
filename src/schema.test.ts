import { describe, it, expect } from "vitest";
import { StreetConfigSchema } from "./schema.js";

describe("StreetConfigSchema", () => {
  it("accepts a minimal valid config", () => {
    const r = StreetConfigSchema.safeParse({
      id: "s",
      name: "T",
      elements: [{ id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5 }],
    });
    expect(r.success).toBe(true);
  });

  it("rejects an unknown element type", () => {
    const r = StreetConfigSchema.safeParse({
      id: "s",
      name: "T",
      elements: [{ id: "e1", type: "MOON", side: "LEFT", width_m: 2.5 }],
    });
    expect(r.success).toBe(false);
  });

  it("rejects a negative width", () => {
    const r = StreetConfigSchema.safeParse({
      id: "s",
      name: "T",
      elements: [{ id: "e1", type: "SIDEWALK", side: "LEFT", width_m: -1 }],
    });
    expect(r.success).toBe(false);
  });
});
