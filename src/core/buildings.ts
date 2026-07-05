import type { StreetElement } from "./types.js";

// Floor-use colours copied verbatim from the app's CrossSectionView (FLOOR_COLORS).
const FLOOR_COLORS: Record<string, string> = {
  Wohnen: "#EDE8C0",
  Gewerbe: "#E4B8B4",
  Gemischt: "#E4CDB0",
  "Öffentlich": "#D8D9D5",
};

export function renderBuilding(
  el: StreetElement,
  x: number,
  widthPx: number,
  groundY: number,
  scale: number,
): string {
  const floors = el.building?.floors ?? [];
  if (floors.length === 0) return "";

  const floorH = 3 * scale; // each floor is 3 m tall
  const parts: string[] = [];
  floors.forEach((floor, i) => {
    const y = groundY - (i + 1) * floorH; // stack upward from the ground line
    const fill = FLOOR_COLORS[floor.use] ?? "#e5e7eb";
    parts.push(
      `<rect x="${x}" y="${y}" width="${widthPx}" height="${floorH}" fill="${fill}" stroke="#6b7280" stroke-width="1"/>`,
    );
  });
  return parts.join("\n");
}
