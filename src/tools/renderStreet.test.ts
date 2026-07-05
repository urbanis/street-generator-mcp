import { describe, it, expect } from "vitest";
import { renderStreetHandler } from "./renderStreet.js";

describe("renderStreetHandler", () => {
  it("returns an SVG text block for a valid config", async () => {
    const res = await renderStreetHandler({
      config: {
        id: "s",
        name: "T",
        elements: [{ id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5 }],
      },
    });
    expect(res.content[0].type).toBe("text");
    expect(res.content[0].text).toContain("<svg");
  });

  it("appends a Street Generator share link", async () => {
    const res = await renderStreetHandler({
      config: { id: "s", name: "T", elements: [{ id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5 }] },
    });
    const joined = res.content.map((c) => c.text).join("\n");
    expect(joined).toContain("streetgenerator.com");
  });
});
