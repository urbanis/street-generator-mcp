import type { StreetConfig } from "./types.js";
import { getElementDef } from "./elements.js";
import { computeLayout, BAND_H, ROAD_OFFSET_M, ANN_H } from "./layout.js";
import { renderFigure } from "./figures.js";
import { renderBuilding } from "./buildings.js";

export interface RenderStyle {
  colorMode?: "outline" | "color";
  showLabels?: boolean;
  showMeasurements?: boolean;
  showFigures?: boolean;
}

const DEFAULTS: Required<RenderStyle> = {
  colorMode: "outline",
  showLabels: true,
  showMeasurements: true,
  showFigures: true,
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderStreetSvg(street: StreetConfig, style: RenderStyle = {}): string {
  const s = { ...DEFAULTS, ...style };
  const layout = computeLayout(street);
  const W = layout.totalWidthPx;
  const roadOffsetPx = ROAD_OFFSET_M * layout.scale;
  const groundY = layout.skyH;
  const bandTop = groundY + roadOffsetPx;
  const H = bandTop + BAND_H + ANN_H;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="sans-serif">`,
  );

  street.elements.forEach((el, i) => {
    const geo = layout.elements[i];
    const def = getElementDef(el.type);
    const fill = s.colorMode === "color" ? def.fill : "#ffffff";
    const stroke = s.colorMode === "color" ? def.stroke : "#333333";
    const cx = geo.x + geo.widthPx / 2;

    // Buildings render as a stacked floor diagram; everything else as a band rect.
    if (
      (el.type === "BUILDING_LEFT" || el.type === "BUILDING_RIGHT") &&
      el.building?.floors.length
    ) {
      parts.push(renderBuilding(el, geo.x, geo.widthPx, groundY, layout.scale));
    } else {
      parts.push(
        `<rect x="${geo.x}" y="${groundY}" width="${geo.widthPx}" height="${BAND_H + roadOffsetPx}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
      );
    }

    // Annotation zone below the ground band: measurements first, then labels.
    if (s.showMeasurements) {
      parts.push(
        `<text x="${cx}" y="${bandTop + BAND_H + 16}" text-anchor="middle" font-size="11" fill="#374151">${el.width_m.toFixed(2)}</text>`,
      );
    }
    if (s.showLabels) {
      const label = el.label ?? def.label;
      parts.push(
        `<text x="${cx}" y="${bandTop + BAND_H + 32}" text-anchor="middle" font-size="11" fill="#374151">${esc(label)}</text>`,
      );
    }
    if (s.showFigures && el.figure?.show) {
      parts.push(renderFigure(el.figure.variant, cx, groundY, geo.widthPx, layout.scale, el.figure.height_m));
    }
  });

  parts.push(
    `<line x1="0" y1="${bandTop + BAND_H}" x2="${W}" y2="${bandTop + BAND_H}" stroke="#9ca3af" stroke-width="1"/>`,
  );
  parts.push(`</svg>`);
  return parts.join("\n");
}
