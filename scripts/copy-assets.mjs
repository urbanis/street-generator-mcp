// tsc doesn't copy non-code files, so mirror the figure SVGs into dist/ after build.
import { cpSync } from "node:fs";

cpSync("src/assets", "dist/assets", { recursive: true });
console.log("Copied src/assets → dist/assets");
