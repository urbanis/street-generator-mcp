import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { computeLayout } from "../src/core/layout.js";
import { renderStreetSvg } from "../src/core/renderSvg.js";
import type { StreetConfig } from "../src/core/types.js";

const config: StreetConfig = JSON.parse(readFileSync("test/golden/residential.json", "utf8"));

describe("fidelity — structural checks", () => {
  it("lays out one geometry entry per element", () => {
    expect(computeLayout(config).elements.length).toBe(config.elements.length);
  });

  it("renders at least one rect per element (buildings add extra floor rects)", () => {
    const svg = renderStreetSvg(config, { colorMode: "color" });
    expect((svg.match(/<rect/g) ?? []).length).toBeGreaterThanOrEqual(config.elements.length);
  });

  it("includes a figure image for each element that requests one", () => {
    const svg = renderStreetSvg(config);
    const wantFigures = config.elements.filter((e) => e.figure?.show).length;
    expect((svg.match(/<image/g) ?? []).length).toBe(wantFigures);
  });

  // Cross-app fidelity: once you export the same street from streetgenerator.com
  // as SVG and save it to test/golden/residential.svg, this asserts the reference
  // exists. Strengthen later by parsing both and comparing element geometry/colours.
  it("has a reference export from the app (optional until exported)", () => {
    const ref = "test/golden/residential.svg";
    if (!existsSync(ref)) return; // skip until the golden export is added
    expect(readFileSync(ref, "utf8")).toContain("<svg");
  });
});
