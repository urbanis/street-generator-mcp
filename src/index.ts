import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreetConfigSchema, RenderStyleSchema } from "./schema.js";
import { renderStreetHandler } from "./tools/renderStreet.js";
import { buildShareUrlHandler } from "./tools/buildShareUrl.js";
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

await server.connect(new StdioServerTransport());
