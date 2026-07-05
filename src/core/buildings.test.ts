import { describe, it, expect } from "vitest";
import { renderBuilding } from "./buildings.js";
import type { StreetElement } from "./types.js";

const bldg: StreetElement = {
  id: "b1",
  type: "BUILDING_LEFT",
  side: "LEFT",
  width_m: 6,
  building: {
    floors: [
      { use: "Wohnen", height_m: 3 },
      { use: "Gewerbe", height_m: 3 },
      { use: "Wohnen", height_m: 3 },
    ],
  },
};

describe("renderBuilding", () => {
  it("draws one rect per floor", () => {
    const out = renderBuilding(bldg, 0, 120, 200, 30);
    expect((out.match(/<rect/g) ?? []).length).toBe(3);
  });

  it("uses the floor-use colour (Wohnen)", () => {
    expect(renderBuilding(bldg, 0, 120, 200, 30)).toContain("#EDE8C0");
  });

  it("returns empty string when there are no floors", () => {
    const empty = { ...bldg, building: { floors: [] } };
    expect(renderBuilding(empty, 0, 120, 200, 30)).toBe("");
  });
});
