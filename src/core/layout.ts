import type { StreetConfig } from "./types.js";

export interface RenderedElement {
  id: string;
  x: number;
  widthPx: number;
}

export interface RenderLayout {
  elements: RenderedElement[];
  totalWidthPx: number;
  scale: number;
  skyH: number;
}

export const BAND_H = 16;
export const ROAD_OFFSET_M = 0.2;
export const SKY_MIN = 40;
export const ANN_H = 80;

const MIN_SCALE = 20;
const MAX_CANVAS_WIDTH = 900;

export function isTreeVariant(variantId: string | undefined): boolean {
  return (
    variantId === "tree-deciduous" ||
    variantId === "tree-conifer" ||
    variantId === "tree-detailed"
  );
}

export function computeLayout(street: StreetConfig): RenderLayout {
  const totalWidth_m = street.elements.reduce((s, e) => s + e.width_m, 0);
  if (totalWidth_m === 0) {
    return { elements: [], totalWidthPx: 0, scale: MIN_SCALE, skyH: SKY_MIN };
  }

  const scale = Math.max(MIN_SCALE, Math.min(MAX_CANVAS_WIDTH / totalWidth_m, 60));
  const totalWidthPx = totalWidth_m * scale;

  let x = 0;
  const elements: RenderedElement[] = street.elements.map((el) => {
    const widthPx = el.width_m * scale;
    const result = { id: el.id, x, widthPx };
    x += widthPx;
    return result;
  });

  // Human/vehicle figure heights in metres — must match variant ids in figures.ts
  const FIGURE_HEIGHTS_M: Partial<Record<string, number>> = {
    "pedestrian-front": 1.8,
    "pedestrian-back": 1.8,
    "pedestrian-senior": 1.8,
    "pedestrian-kid-back": 1.8,
    "car-front": 1.25,
    "car-back": 1.25,
    "car-perpendicular": 1.25,
    "car-parallel": 1.25,
  };

  const skyH = street.elements.reduce((max, el) => {
    if (
      (el.type === "BUILDING_LEFT" || el.type === "BUILDING_RIGHT") &&
      el.building &&
      el.building.floors.length > 0
    ) {
      return Math.max(max, el.building.floors.length * 3 * scale);
    }
    if (el.figure?.show) {
      const variantId = el.figure.variant;
      if (isTreeVariant(variantId)) {
        const h = (el.figure.height_m ?? 8) * scale;
        return Math.max(max, h + 8);
      }
      const h = FIGURE_HEIGHTS_M[variantId];
      if (h) return Math.max(max, h * scale + 8);
    }
    return max;
  }, SKY_MIN);

  return { elements, totalWidthPx, scale, skyH };
}
