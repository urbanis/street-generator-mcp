import { describe, it, expect } from "vitest";
import { osmTagsToStreetConfig } from "./mapper.js";

describe("osmTagsToStreetConfig", () => {
  it("builds a two-way residential street with sidewalks", () => {
    const cfg = osmTagsToStreetConfig({
      name: "Test St",
      highway: "residential",
      lanes: "2",
      sidewalk: "both",
    });
    const types = cfg.elements.map((e) => e.type);
    expect(cfg.name).toBe("Test St");
    expect(types.filter((t) => t === "SIDEWALK")).toHaveLength(2);
    expect(types.filter((t) => t === "TRAFFIC_LANE")).toHaveLength(2);
  });

  it("adds cycle lanes and buffers when cycleway=lane", () => {
    const cfg = osmTagsToStreetConfig({ cycleway: "lane", lanes: "2" });
    const types = cfg.elements.map((e) => e.type);
    expect(types).toContain("CYCLE_LANE");
    expect(types).toContain("BUFFER");
  });

  it("falls back to a default name when unnamed", () => {
    expect(osmTagsToStreetConfig({ highway: "residential" }).name).toBe("OSM Street");
  });
});
