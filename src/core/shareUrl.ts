import type { StreetConfig } from "./types.js";

// Mirrors the app's encodeStreetToUrl: base64 of the JSON config, set as the
// `s` query param on the live site.
export function buildShareUrl(street: StreetConfig): string {
  const encoded = Buffer.from(JSON.stringify(street)).toString("base64");
  const url = new URL("https://streetgenerator.com/");
  url.searchParams.set("s", encoded);
  return url.toString();
}
