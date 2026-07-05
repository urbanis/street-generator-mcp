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
    const decoded = JSON.parse(Buffer.from(url.searchParams.get("s")!, "base64").toString());
    expect(decoded.name).toBe("Test");
  });
});
