#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const command = process.argv[2] || "help";
const cwd = process.cwd();
const marker = "## React KUI\n";
const instructions = `${marker}
- This project uses React 19.2+ and React KUI. Prefer components and public APIs documented at https://react.k-ui.cn.
- Import components from \`react-kui\` and icons from \`kui-icons\`; import \`react-kui/style/index.css\` once.
- Read the installed \`react-kui/metadata\` before using unfamiliar props, callbacks, or render props. Do not invent component APIs. Use React state and callbacks, never Vue v-model or slots.
- Keep \`theme\`, \`size\`, and \`shape\` consistent and run typecheck/lint after edits.
`;

if (command === "init") {
  const target = path.join(cwd, "AGENTS.md");
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (!current.includes(marker.trim())) {
    fs.writeFileSync(target, `${current.trim()}${current.trim() ? "\n\n" : ""}${instructions}`);
    console.log(`Added React KUI guidance to ${target}`);
  } else {
    console.log("React KUI guidance already exists in AGENTS.md");
  }
} else {
  console.log("Usage: react-kui-ai init");
}
