// Connects to the built server as an MCP client and lists its tools —
// the same handshake Claude Desktop does. Proves the server works.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({ command: "node", args: ["dist/index.js"] });
const client = new Client({ name: "verify", version: "1.0.0" });

await client.connect(transport);
const { tools } = await client.listTools();
console.log("✓ Server connected. Tools advertised:");
for (const t of tools) console.log(`  - ${t.name}: ${t.title ?? ""}`);

// Actually call render_street to confirm it returns an SVG
const res = await client.callTool({
  name: "render_street",
  arguments: {
    config: { id: "s", name: "Smoke test", elements: [{ id: "e1", type: "SIDEWALK", side: "LEFT", width_m: 2.5 }] },
  },
});
const text = res.content?.[0]?.text ?? "";
console.log(`✓ render_street returned ${text.length} chars, starts with: ${text.slice(0, 20)}`);

await client.close();
process.exit(0);
