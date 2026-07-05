import { describe, it, expect } from "vitest";
import { buildShareUrl } from "./shareUrl.js";
import type { StreetConfig } from "./types.js";

const cfg: StreetConfig = { id: "s", name: "Test", elements: [] };

describe("buildShareUrl", () => {
  it("points at streetgenerator.com with an s param", () => {
    const url = new URL(buildShareUrl(cfg));
    expect(url.origin).toBe("https://streetgenerator.com");
    expect(url.searchParams.get("s")).toBeTruthy();
  });

  it("round-trips: decoding s yields the original config", () => {
    const url = new URL(buildShareUrl(cfg));
    // atob() reads one byte per char, so decode as latin1 to mimic the browser.
    const decoded = JSON.parse(Buffer.from(url.searchParams.get("s")!, "base64").toString("latin1"));
    expect(decoded.name).toBe("Test");
  });

  it("preserves middle-dots and umlauts (no mojibake)", () => {
    const special: StreetConfig = {
      id: "s",
      name: "Große Straße",
      subtitle: "Wide sidewalks · street trees · protected bike lanes",
      elements: [],
    };
    const url = new URL(buildShareUrl(special));
    const decoded = JSON.parse(Buffer.from(url.searchParams.get("s")!, "base64").toString("latin1"));
    expect(decoded.subtitle).toBe("Wide sidewalks · street trees · protected bike lanes");
    expect(decoded.name).toBe("Große Straße");
  });
});
