import { renderStreetSvg, type RenderStyle } from "../core/renderSvg.js";
import { buildShareUrl } from "../core/shareUrl.js";
import type { StreetConfig } from "../core/types.js";

export async function renderStreetHandler(args: { config: StreetConfig; style?: RenderStyle }) {
  const svg = renderStreetSvg(args.config, args.style);
  const url = buildShareUrl(args.config);
  return {
    content: [
      { type: "text" as const, text: svg },
      { type: "text" as const, text: `Open in Street Generator: ${url}` },
    ],
  };
}
