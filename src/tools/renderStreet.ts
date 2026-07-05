import { renderStreetSvg, type RenderStyle } from "../core/renderSvg.js";
import type { StreetConfig } from "../core/types.js";

export async function renderStreetHandler(args: { config: StreetConfig; style?: RenderStyle }) {
  const svg = renderStreetSvg(args.config, args.style);
  return { content: [{ type: "text" as const, text: svg }] };
}
