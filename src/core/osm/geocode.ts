export interface GeocodeCandidate {
  lat: number;
  lng: number;
  label: string;
}

export interface AddressFields {
  street: string;
  houseNumber: string;
  city: string;
  postcode: string;
  country: string;
}

// Geocodes a structured address via OpenStreetMap's Nominatim. `fetchImpl` is
// injectable so tests can run offline with a mocked fetch.
export async function geocodeAddress(
  addr: AddressFields,
  fetchImpl: typeof fetch = fetch,
): Promise<GeocodeCandidate[]> {
  const params = new URLSearchParams({
    format: "json",
    street: `${addr.houseNumber} ${addr.street}`.trim(),
    city: addr.city,
    postalcode: addr.postcode,
    country: addr.country,
    limit: "5",
    addressdetails: "1",
  });
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const res = await fetchImpl(url, {
    // Nominatim's usage policy requires an identifying User-Agent.
    headers: { "User-Agent": "street-generator-mcp/0.1 (+https://streetgenerator.com)" },
  });
  if (!res.ok) throw new Error(`Geocoding failed: HTTP ${res.status}`);

  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  return data.map((d) => ({ lat: parseFloat(d.lat), lng: parseFloat(d.lon), label: d.display_name }));
}
