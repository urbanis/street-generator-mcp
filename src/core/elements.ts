import type { ElementType } from "./types.js";

export interface ElementDef {
  type: ElementType;
  label: string;
  defaultWidth_m: number;
  fill: string;
  stroke: string;
}

// Values copied verbatim from the app's src/elements/registry.tsx so the
// MCP renders in exactly the same colours and default widths.
const REGISTRY: ElementDef[] = [
  { type: "SIDEWALK",        label: "Sidewalk",          defaultWidth_m: 2.5,  fill: "#f5f0e8", stroke: "#c8b89a" },
  { type: "CYCLE_LANE",      label: "Cycle lane",        defaultWidth_m: 2.0,  fill: "#C4CCB7", stroke: "#7A8C70" },
  { type: "CYCLE_LANE_ROAD", label: "Cycle lane (road)", defaultWidth_m: 1.5,  fill: "#C4CCB7", stroke: "#7A8C70" },
  { type: "BUFFER",          label: "Buffer",            defaultWidth_m: 0.75, fill: "#D4CFA0", stroke: "#A8A060" },
  { type: "PARKING_LANE",    label: "Parking lane",      defaultWidth_m: 4.8,  fill: "#e0e7ff", stroke: "#6366f1" },
  { type: "TRAFFIC_LANE",    label: "Traffic lane",      defaultWidth_m: 3.25, fill: "#d1d5db", stroke: "#6b7280" },
  { type: "BUS_LANE",        label: "Bus lane",          defaultWidth_m: 3.5,  fill: "#D4CFA0", stroke: "#A8A060" },
  { type: "MEDIAN",          label: "Median",            defaultWidth_m: 1.5,  fill: "#C4CCB7", stroke: "#7A8C70" },
  { type: "PLANTING_STRIP",  label: "Planting strip",    defaultWidth_m: 1.5,  fill: "#C4CCB7", stroke: "#7A8C70" },
  { type: "BUILDING_LEFT",   label: "Building left",     defaultWidth_m: 6,    fill: "#e5e7eb", stroke: "#6b7280" },
  { type: "BUILDING_RIGHT",  label: "Building right",    defaultWidth_m: 6,    fill: "#e5e7eb", stroke: "#6b7280" },
];

const BY_TYPE = new Map<ElementType, ElementDef>(REGISTRY.map((d) => [d.type, d]));

export function getElementDef(type: ElementType): ElementDef {
  const def = BY_TYPE.get(type);
  if (!def) throw new Error(`Unknown element type: ${type}`);
  return def;
}

export { REGISTRY };
