import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreetConfigSchema, RenderStyleSchema, importStreetInputShape } from "./schema.js";
import { renderStreetHandler } from "./tools/renderStreet.js";
import { buildShareUrlHandler } from "./tools/buildShareUrl.js";
import { importStreetHandler, type ImportStreetArgs } from "./tools/importStreet.js";
import type { StreetConfig } from "./core/types.js";
import type { RenderStyle } from "./core/renderSvg.js";

const server = new McpServer({ name: "street-generator", version: "0.1.0" });

server.registerTool(
  "render_street",
  {
    title: "Render street cross-section",
    description:
      "Render a StreetConfig as an illustrated SVG cross-section (people, cars, trees included). " +
      "Claude produces the StreetConfig from the user's description; this tool draws it deterministically " +
      "in the Street Generator visual style.",
    inputSchema: { config: StreetConfigSchema, style: RenderStyleSchema.optional() },
  },
  async (args) => renderStreetHandler(args as { config: StreetConfig; style?: RenderStyle }),
);

server.registerTool(
  "build_share_url",
  {
    title: "Build share link",
    description:
      "Return a streetgenerator.com link that opens this StreetConfig in the live Street Generator app.",
    inputSchema: { config: StreetConfigSchema },
  },
  async (args) => buildShareUrlHandler(args as { config: StreetConfig }),
);

server.registerTool(
  "import_street_from_osm",
  {
    title: "Import a real street from an address",
    description:
      "Render a real street cross-section by reading its layout from OpenStreetMap. " +
      "Requires a COMPLETE address: street, house number, city, postcode, and country. " +
      "If the user hasn't provided all of these, or the address is unclear, ASK them for the " +
      "missing parts before calling. If several places match, the tool returns lettered candidates " +
      "(A, B, C…); show them to the user, then call again with the chosen candidate's lat and lng.",
    inputSchema: importStreetInputShape,
  },
  async (args) => importStreetHandler(args as ImportStreetArgs),
);

await server.connect(new StdioServerTransport());
