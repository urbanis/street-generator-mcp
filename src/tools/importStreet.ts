import { geocodeAddress, type AddressFields } from "../core/osm/geocode.js";
import { fetchOsmStreetAt } from "../core/osm/fetch.js";
import { osmTagsToStreetConfig } from "../core/osm/mapper.js";
import { renderStreetSvg, type RenderStyle } from "../core/renderSvg.js";
import { buildShareUrl } from "../core/shareUrl.js";

export interface ImportStreetArgs extends AddressFields {
  lat?: number;
  lng?: number;
  style?: RenderStyle;
}

const LETTERS = "ABCDEFGHIJ";

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export async function importStreetHandler(args: ImportStreetArgs) {
  let { lat, lng } = args;
  let matchedLabel = "";

  // Geocode unless the caller already resolved coordinates (disambiguation re-call).
  if (lat === undefined || lng === undefined) {
    const candidates = await geocodeAddress(args);

    if (candidates.length === 0) {
      return textResult(
        "Couldn't locate that address. Please double-check the street, house number, city, postcode and country.",
      );
    }

    if (candidates.length > 1) {
      const list = candidates
        .map((c, i) => `${LETTERS[i]}. ${c.label}  (lat ${c.lat.toFixed(5)}, lng ${c.lng.toFixed(5)})`)
        .join("\n");
      return textResult(
        `I found several matches — which one?\n${list}\n\n` +
          "Tell me the letter; I'll call this tool again with that candidate's lat and lng to render it.",
      );
    }

    lat = candidates[0].lat;
    lng = candidates[0].lng;
    matchedLabel = candidates[0].label;
  }

  const tags = await fetchOsmStreetAt(lat, lng);
  if (!tags) {
    return textResult("Found the location but no mapped street nearby in OpenStreetMap.");
  }

  const config = osmTagsToStreetConfig(tags);
  const svg = renderStreetSvg(config, args.style);
  const url = buildShareUrl(config);
  const header = matchedLabel ? `Matched: ${config.name} (${matchedLabel})` : `Matched: ${config.name}`;

  return {
    content: [
      { type: "text" as const, text: header },
      { type: "text" as const, text: svg },
      { type: "text" as const, text: `Open in Street Generator: ${url}` },
    ],
  };
}
