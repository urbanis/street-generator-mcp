import { randomUUID } from "node:crypto";
import type { StreetConfig } from "../types.js";
import type { OsmStreetTags } from "./fetch.js";
import { interpretOsmTags } from "./interpreter.js";
import type { InterpretedTags, CyclewayType } from "./interpreter.js";

export function osmTagsToStreetConfig(tags: OsmStreetTags): StreetConfig {
  const interp = interpretOsmTags(tags);
  const name = tags["name"] ?? tags["addr:street"] ?? "OSM Street";
  return interpretedToStreetConfig(interp, name);
}

function interpretedToStreetConfig(interp: InterpretedTags, name: string): StreetConfig {
  const elements: StreetConfig["elements"] = [];

  const laneWidth =
    interp.width_m && interp.lanes.total > 0 ? Math.max(2.5, interp.width_m / interp.lanes.total) : 3.25;

  const total = interp.lanes.total;
  const oneway = interp.lanes.oneway;
  const forward = interp.lanes.forward ?? (oneway ? total : Math.ceil(total / 2));
  const backward = interp.lanes.backward ?? (oneway ? 0 : Math.floor(total / 2));

  // ── LEFT side (outermost → innermost) ──
  if (interp.sidewalk.left !== "no") {
    elements.push({ id: randomUUID(), type: "SIDEWALK", side: "LEFT", width_m: 2.5 });
  }
  pushCycleway(elements, "LEFT", interp.cycleway.left, interp.bicycleRoad);
  if (interp.parking.left.type === "lane" || interp.parking.left.type === "street_side") {
    elements.push({ id: randomUUID(), type: "PARKING_LANE", side: "LEFT", width_m: 2.0 });
  }
  if (interp.bicycleRoad) {
    for (let i = 0; i < backward; i++) {
      elements.push({ id: randomUUID(), type: "CYCLE_LANE", side: "LEFT", width_m: laneWidth });
    }
  } else {
    for (let i = 0; i < backward; i++) {
      elements.push({ id: randomUUID(), type: "TRAFFIC_LANE", side: "LEFT", width_m: laneWidth });
    }
  }

  // ── RIGHT side (innermost → outermost) ──
  if (interp.bicycleRoad) {
    for (let i = 0; i < forward; i++) {
      elements.push({ id: randomUUID(), type: "CYCLE_LANE", side: "RIGHT", width_m: laneWidth });
    }
  } else {
    for (let i = 0; i < forward; i++) {
      elements.push({ id: randomUUID(), type: "TRAFFIC_LANE", side: "RIGHT", width_m: laneWidth });
    }
  }
  if (interp.parking.right.type === "lane" || interp.parking.right.type === "street_side") {
    elements.push({ id: randomUUID(), type: "PARKING_LANE", side: "RIGHT", width_m: 2.0 });
  }
  pushCycleway(elements, "RIGHT", interp.cycleway.right, interp.bicycleRoad);
  if (interp.sidewalk.right !== "no") {
    elements.push({ id: randomUUID(), type: "SIDEWALK", side: "RIGHT", width_m: 2.5 });
  }

  return { id: randomUUID(), name, elements };
}

function pushCycleway(
  elements: StreetConfig["elements"],
  side: "LEFT" | "RIGHT",
  type: CyclewayType,
  bicycleRoad: boolean,
): void {
  if (bicycleRoad) return;
  if (type === "none") return;

  const cycleWidth = type === "track" ? 2.5 : 2.0;

  if (side === "LEFT") {
    elements.push({ id: randomUUID(), type: "CYCLE_LANE", side: "LEFT", width_m: cycleWidth });
    elements.push({ id: randomUUID(), type: "BUFFER", side: "LEFT", width_m: 0.75 });
  } else {
    elements.push({ id: randomUUID(), type: "BUFFER", side: "RIGHT", width_m: 0.75 });
    elements.push({ id: randomUUID(), type: "CYCLE_LANE", side: "RIGHT", width_m: cycleWidth });
  }
}
