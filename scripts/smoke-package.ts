import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

// Install the tarball outside the repository so source aliases cannot hide packaging errors.
const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "react-kui-package-"));
const tarball = process.argv[2] ? path.resolve(process.argv[2]) : path.join(temp, "react-kui.tgz");
const run = (cmd: string, args: string[], cwd = temp) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit" });
try {
  if (!process.argv[2]) run("pnpm", ["pack", "--out", tarball], root);
  fs.writeFileSync(
    path.join(temp, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: {
        "react-kui": `file:${tarball}`,
        react: process.env.SMOKE_REACT_VERSION || "19.2.0",
        "react-dom": process.env.SMOKE_REACT_VERSION || "19.2.0",
      },
      devDependencies: {
        typescript: "~6.0.3",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
      },
    }),
  );
  run("pnpm", ["install", "--ignore-scripts", "--no-frozen-lockfile"]);
  fs.writeFileSync(
    path.join(temp, "check.mjs"),
    `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as esm from "react-kui";
const require = createRequire(import.meta.url);
const cjs = require("react-kui");
assert.deepEqual(Object.keys(esm).sort(), Object.keys(cjs).sort());
for (const lib of [esm, cjs]) {
  const html = renderToStaticMarkup(React.createElement(lib.Select, { filterable: true, value: "", placeholder: "Choose", options: [{ label: "One", value: 1 }] }));
  assert.match(html, /k-select-placeholder/);
  assert.match(html, /Choose/);
}
for (const file of ["react-kui/style/index.css", "react-kui/style/theme.css", "react-kui/style/components.css", "react-kui/style/base.css", "react-kui/metadata", "react-kui/metadata/schema", "react-kui/skill"]) assert.ok(fs.statSync(require.resolve(file)).size);
const pkgPath = require.resolve("react-kui/package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
for (const [name, file] of Object.entries(pkg.bin)) {
  const args = name === "react-kui-ai" ? ["init"] : [];
  const result = spawnSync(process.execPath, [new URL(file, "file://" + pkgPath).pathname, ...args], {
    encoding: "utf8", input: name === "react-kui-mcp" ? JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "validate_kui_usage", arguments: { source: 'import { Button } from "react-kui"; const view = <Button>OK</Button>;' } } }) + "\\n" : undefined,
  });
  assert.equal(result.status, 0, result.stderr);
  if (name === "react-kui-mcp") assert.equal(JSON.parse(result.stdout).result.structuredContent.result.valid, true);
}
console.log("Packed ESM/CJS, Select rendering, styles, metadata, CLI and MCP passed.");
`,
  );
  fs.writeFileSync(
    path.join(temp, "consumer.tsx"),
    `import { Select, Button, type SelectProps } from "react-kui";
const props: SelectProps = { filterable: true, value: "", options: [{ label: "One", value: 1 }] };
export const example = <><Select {...props} /><Button htmlType="submit">Save</Button></>;
`,
  );
  fs.writeFileSync(
    path.join(temp, "consumer.cts"),
    `
import React = require("react");
import { Select, Button, type SelectProps } from "react-kui";
import zhCN from "react-kui/locale/zh-CN";
const props: SelectProps = { value: "", options: [{ label: "One", value: 1 }] };
export const example = React.createElement(Select, props);
export const button = React.createElement(Button, { htmlType: "submit" });
export const locale = zhCN;
`,
  );
  run(process.execPath, ["check.mjs"]);
  run(process.execPath, [
    "--max-old-space-size=2048",
    "node_modules/typescript/bin/tsc",
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "false",
    "--jsx",
    "react-jsx",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2022",
    "consumer.tsx",
    "consumer.cts",
  ]);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
