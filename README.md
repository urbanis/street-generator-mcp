# street-generator-mcp

An [MCP](https://modelcontextprotocol.io) server that lets Claude design and render
**urban street cross-sections** from natural language — in the visual style of the
[Street Generator](https://streetgenerator.com) app, figures and all.

Describe a street; Claude produces the structured design; this server renders it to a
self-contained SVG and can hand back a link to open it in the live app.

---

## The idea

> **Claude does the open-ended reasoning (designing the street). The server does the
> deterministic work (drawing it).**

The server contains **no LLM, no API keys, no secrets**. It minimises what the model has to
produce — a small structured `StreetConfig` instead of thousands of tokens of hand-drawn
SVG — and moves the heavy, exact rendering into code. That makes it **faster, cheaper, and
reliable**: every street is drawn by the same renderer, identical every time.

```
User: "a calm residential street, wide sidewalks, trees, protected bike lanes"
   │
   ▼
Claude → StreetConfig (JSON), guided by the tool's schema
   │
   ├─ render_street(config, style)   → server draws an illustrated SVG
   └─ build_share_url(config)        → streetgenerator.com/?s=…
   │
   ▼
Claude shows the image and the link
```

## Tools

### `render_street(config, style?)`
Renders a `StreetConfig` to an illustrated SVG cross-section (buildings as floor stacks,
sidewalks with pedestrians, planting strips with trees, lanes with cars).

`style` (optional): `colorMode` `"outline"` (default) | `"color"`, and `showLabels`,
`showMeasurements`, `showFigures` (all default `true`).

### `build_share_url(config)`
Returns a `streetgenerator.com` link that opens the design in the live app.

## Install (Claude Desktop)

```json
{
  "mcpServers": {
    "street-generator": {
      "command": "npx",
      "args": ["-y", "street-generator-mcp"]
    }
  }
}
```

Then ask Claude to design a street and it will call the tools automatically.

## Develop

```bash
npm install
npm test          # unit + fidelity tests
npm run build     # compile to dist/ and copy figure assets
npm run dev       # run the server from source
```

## How the rendering stays faithful to the app

The layout math and figure/element data are ported value-for-value from the Street Generator
app. Fidelity is verified with structural tests (`test/fidelity.test.ts`) against a reference
config; drop an SVG exported from the app into `test/golden/residential.svg` to enable the
full cross-app check.

## Future work
- `validate_street` tool (Berlin RASt rules — the engine already exists in the app).
- PNG output (SVG→raster).
- Figures for cycle and bus lanes once art exists.
- A shared rendering package so app/MCP fidelity is automatic rather than copied.
