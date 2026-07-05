import { describe, it, expect, vi } from "vitest";
import { geocodeAddress, type AddressFields } from "./geocode.js";

const addr: AddressFields = {
  street: "Kurfürstendamm",
  houseNumber: "12",
  city: "Berlin",
  postcode: "10719",
  country: "Germany",
};

function mockFetch(payload: unknown, ok = true) {
  return vi.fn(async () => ({
    ok,
    status: ok ? 200 : 500,
    json: async () => payload,
  })) as unknown as typeof fetch;
}

describe("geocodeAddress", () => {
  it("maps Nominatim results to candidates", async () => {
    const f = mockFetch([{ lat: "52.5001", lon: "13.3300", display_name: "Kurfürstendamm 12, Berlin" }]);
    const out = await geocodeAddress(addr, f);
    expect(out).toHaveLength(1);
    expect(out[0].lat).toBeCloseTo(52.5001);
    expect(out[0].lng).toBeCloseTo(13.33);
    expect(out[0].label).toContain("Kurfürstendamm");
  });

  it("returns multiple candidates when Nominatim is ambiguous", async () => {
    const f = mockFetch([
      { lat: "52.50", lon: "13.33", display_name: "A" },
      { lat: "52.48", lon: "13.30", display_name: "B" },
    ]);
    expect(await geocodeAddress(addr, f)).toHaveLength(2);
  });

  it("throws on a failed HTTP response", async () => {
    const f = mockFetch([], false);
    await expect(geocodeAddress(addr, f)).rejects.toThrow(/Geocoding failed/);
  });
});
