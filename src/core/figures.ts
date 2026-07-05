import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { ElementType } from "./types.js";
import { isTreeVariant } from "./layout.js";

const here = dirname(fileURLToPath(import.meta.url));
const assetDir = join(here, "..", "assets", "figures");

function dataUri(file: string): string {
  const b64 = readFileSync(join(assetDir, file)).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

export interface FigureVariant {
  id: string;
  ratio: number; // intrinsic width / height
  heightM: number; // real-world height in metres
  asset: string; // inlined data-URI
}

// Ratios and heights copied verbatim from the app's src/figures/registry.tsx.
const REGISTRY: Partial<Record<ElementType, FigureVariant[]>> = {
  SIDEWALK: [
    { id: "pedestrian-front", ratio: 182.84 / 454.4, heightM: 1.8, asset: dataUri("sidewalk-man-front.svg") },
    { id: "pedestrian-back", ratio: 182.84 / 454.4, heightM: 1.8, asset: dataUri("sidewalk-man-back.svg") },
    { id: "pedestrian-senior", ratio: 182.84 / 454.4, heightM: 1.8, asset: dataUri("sidewalk-senior-front.svg") },
    { id: "pedestrian-kid-back", ratio: 182.84 / 454.4, heightM: 1.8, asset: dataUri("sidewalk-man-kid-back.svg") },
  ],
  TRAFFIC_LANE: [
    { id: "car-front", ratio: 238.5 / 207.35, heightM: 1.25, asset: dataUri("traffic-lane-auto-front.svg") },
    { id: "car-back", ratio: 243.15 / 207.35, heightM: 1.25, asset: dataUri("traffic-lane-auto-back.svg") },
  ],
  PARKING_LANE: [
    { id: "car-perpendicular", ratio: 546.01 / 207.35, heightM: 1.25, asset: dataUri("parking-left.svg") },
    { id: "car-parallel", ratio: 238.5 / 207.35, heightM: 1.25, asset: dataUri("traffic-lane-auto-front.svg") },
  ],
  PLANTING_STRIP: [
    { id: "tree-detailed", ratio: 600.63 / 580.67, heightM: 6, asset: dataUri("tree-detailed.svg") },
  ],
  MEDIAN: [
    { id: "tree-detailed", ratio: 600.63 / 580.67, heightM: 6, asset: dataUri("tree-detailed.svg") },
  ],
};

const ALL = new Map<string, FigureVariant>();
for (const list of Object.values(REGISTRY)) {
  for (const v of list!) ALL.set(v.id, v);
}

export function getFigureVariants(type: ElementType): FigureVariant[] | undefined {
  return REGISTRY[type];
}

export function getDefaultFigureVariant(type: ElementType): string | undefined {
  return REGISTRY[type]?.[0]?.id;
}

export function renderFigure(
  variantId: string,
  cx: number,
  groundY: number,
  widthPx: number,
  scale: number,
  heightM?: number,
): string {
  const v = ALL.get(variantId);
  if (!v) return "";
  const h = isTreeVariant(variantId) ? (heightM ?? v.heightM) * scale : v.heightM * scale;
  const w = h * v.ratio;
  const x = cx - w / 2;
  const y = groundY - h;
  return `<image href="${v.asset}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
}
