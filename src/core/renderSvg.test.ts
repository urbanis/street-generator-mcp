import { describe, it, expect } from "vitest";
import { renderStreetSvg } from "./renderSvg.js";
import type { StreetConfig } from "./types.js";

const oneSidewalk: StreetConfig = {
  id: "s",
  name: "Test St",
  elements: [{ id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5 }],
};

describe("renderStreetSvg", () => {
  it("returns a valid SVG root", () => {
    const svg = renderStreetSvg(oneSidewalk);
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.trim().endsWith("</svg>")).toBe(true);
  });

  it("draws one rect per element", () => {
    const svg = renderStreetSvg(oneSidewalk);
    expect((svg.match(/<rect/g) ?? []).length).toBeGreaterThanOrEqual(1);
  });

  it("uses the element fill in colour mode", () => {
    const svg = renderStreetSvg(oneSidewalk, { colorMode: "color" });
    expect(svg).toContain("#f5f0e8");
  });

  it("omits labels when showLabels is false", () => {
    const svg = renderStreetSvg(oneSidewalk, { showLabels: false });
    expect(svg).not.toContain("Sidewalk");
  });

  it("shows the label by default", () => {
    expect(renderStreetSvg(oneSidewalk)).toContain("Sidewalk");
  });

  it("draws a figure image when the element has a shown figure", () => {
    const withFig: StreetConfig = {
      id: "s",
      name: "t",
      elements: [
        { id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5, figure: { show: true, variant: "pedestrian-front" } },
      ],
    };
    expect(renderStreetSvg(withFig)).toContain("<image");
  });

  it("omits figures when showFigures is false", () => {
    const withFig: StreetConfig = {
      id: "s",
      name: "t",
      elements: [
        { id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5, figure: { show: true, variant: "pedestrian-front" } },
      ],
    };
    expect(renderStreetSvg(withFig, { showFigures: false })).not.toContain("<image");
  });

  it("widens slim buildings to a sensible minimum width", () => {
    const s: StreetConfig = {
      id: "s",
      name: "t",
      elements: [
        { id: "b", type: "BUILDING_LEFT", side: "LEFT", width_m: 4, building: { floors: [{ use: "Wohnen", height_m: 3 }] } },
      ],
    };
    // width_m 4 should be bumped to the 10 m minimum, shown in the measurement
    expect(renderStreetSvg(s)).toContain("10.00");
  });

  it("renders a building as a floor stack", () => {
    const withBldg: StreetConfig = {
      id: "s",
      name: "t",
      elements: [
        {
          id: "b1",
          type: "BUILDING_LEFT",
          side: "LEFT",
          width_m: 6,
          building: { floors: [{ use: "Wohnen", height_m: 3 }, { use: "Gewerbe", height_m: 3 }] },
        },
      ],
    };
    const svg = renderStreetSvg(withBldg, { colorMode: "color" });
    expect(svg).toContain("#EDE8C0"); // Wohnen floor colour
  });
});
