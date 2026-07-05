import type { StreetConfig } from "./types.js";

// Mirrors the app's encodeStreetToUrl: base64 of the JSON config, set as the
// `s` query param on the live site.
export function buildShareUrl(street: StreetConfig): string {
  // The app decodes with atob(), which reads one byte per character (Latin-1),
  // matching the browser's btoa() it encoded with. Encode the same way — NOT
  // UTF-8 — so "·" and umlauts survive the round-trip instead of becoming
  // mojibake like "Â·".
  const encoded = Buffer.from(JSON.stringify(street), "latin1").toString("base64");
  const url = new URL("https://streetgenerator.com/");
  url.searchParams.set("s", encoded);
  return url.toString();
}
