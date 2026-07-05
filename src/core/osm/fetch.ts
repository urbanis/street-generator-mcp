export interface OsmStreetTags {
  [key: string]: string | undefined;
}

// Ported from the app's src/osm/fetch.ts. Queries Overpass for a highway way
// near a point and returns its raw tags (or null if none found).
export async function fetchOsmStreetAt(
  lat: number,
  lng: number,
  signal?: AbortSignal,
  radiusM = 60,
): Promise<OsmStreetTags | null> {
  // A geocoded address sits on a building, which can be tens of metres from the
  // street centreline — so search within a radius (not the app's tight bbox,
  // which assumed a click on the road itself).
  const query = `
    [out:json][timeout:15];
    way(around:${radiusM},${lat},${lng})["highway"];
    out tags 1;
  `;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  const res = await fetch(url, {
    signal,
    // Overpass rejects anonymous requests (HTTP 406); identify ourselves.
    headers: { "User-Agent": "street-generator-mcp/0.1 (+https://streetgenerator.com)" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { elements?: Array<{ tags?: OsmStreetTags }> };
  const way = data?.elements?.[0];
  return way?.tags ?? null;
}
