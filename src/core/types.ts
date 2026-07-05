export type ElementType =
  | "SIDEWALK"
  | "CYCLE_LANE"
  | "CYCLE_LANE_ROAD"
  | "BUFFER"
  | "PARKING_LANE"
  | "TRAFFIC_LANE"
  | "BUS_LANE"
  | "MEDIAN"
  | "PLANTING_STRIP"
  | "BUILDING_LEFT"
  | "BUILDING_RIGHT";

export type Side = "LEFT" | "CENTER" | "RIGHT";

export type FloorUse = "Wohnen" | "Gewerbe" | "Gemischt" | "Öffentlich";

export interface ElementStyle {
  fill: string;
  stroke: string;
}

export interface BuildingFloor {
  use: FloorUse;
  height_m: number;
}

export interface BuildingData {
  floors: BuildingFloor[];
}

export interface FigureConfig {
  show: boolean;
  variant: string;
  height_m?: number;
}

export interface StreetElement {
  id: string;
  type: ElementType;
  side: Side;
  width_m: number;
  label?: string;
  style?: ElementStyle;
  building?: BuildingData;
  figure?: FigureConfig;
}

export interface StreetConfig {
  id: string;
  name: string;
  subtitle?: string;
  totalWidth_m?: number;
  elements: StreetElement[];
}
