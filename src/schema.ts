import { z } from "zod";

export const ElementTypeSchema = z.enum([
  "SIDEWALK",
  "CYCLE_LANE",
  "CYCLE_LANE_ROAD",
  "BUFFER",
  "PARKING_LANE",
  "TRAFFIC_LANE",
  "BUS_LANE",
  "MEDIAN",
  "PLANTING_STRIP",
  "BUILDING_LEFT",
  "BUILDING_RIGHT",
]);

const FloorSchema = z.object({
  use: z.enum(["Wohnen", "Gewerbe", "Gemischt", "Öffentlich"]),
  height_m: z.number().positive(),
});

export const StreetElementSchema = z.object({
  id: z.string(),
  type: ElementTypeSchema,
  side: z.enum(["LEFT", "CENTER", "RIGHT"]).default("LEFT"),
  width_m: z.number().positive().describe("Width in metres"),
  label: z.string().optional(),
  figure: z
    .object({
      show: z.boolean().default(true),
      variant: z
        .string()
        .describe("Figure variant id, e.g. pedestrian-front, car-front, tree-detailed"),
      height_m: z.number().positive().optional(),
    })
    .optional(),
  building: z.object({ floors: z.array(FloorSchema) }).optional(),
});

export const StreetConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  elements: z.array(StreetElementSchema).describe("Ordered left → right across the street"),
});

export const RenderStyleSchema = z
  .object({
    colorMode: z.enum(["outline", "color"]).default("outline"),
    showLabels: z.boolean().default(true),
    showMeasurements: z.boolean().default(true),
    showFigures: z.boolean().default(true),
  })
  .partial();
