import { buildShareUrl } from "../core/shareUrl.js";
import type { StreetConfig } from "../core/types.js";

export async function buildShareUrlHandler(args: { config: StreetConfig }) {
  const url = buildShareUrl(args.config);
  return { content: [{ type: "text" as const, text: url }] };
}
