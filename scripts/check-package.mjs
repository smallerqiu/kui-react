import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const npmCache = path.join(root, "node_modules/.cache/npm-pack");
const requiredFiles = [
  "es/index.js",
  "lib/index.cjs",
  "style/index.css",
  "types/index.d.ts",
  "README.md",
  "README.zh-CN.md",
  "package.json",
];

const packOutput = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  cwd: root,
  env: { ...process.env, npm_config_cache: npmCache },
  encoding: "utf8",
});
const pack = JSON.parse(packOutput)[0];
const packedFiles = new Set(pack.files.map((file) => file.path));
const missing = requiredFiles.filter((file) => !packedFiles.has(file));
if (missing.length) throw new Error(`npm package is missing: ${missing.join(", ")}`);

const esm = await import(path.join(root, "es/index.js"));
const require = createRequire(import.meta.url);
const cjs = require(path.join(root, "lib/index.cjs"));
const esmExports = Object.keys(esm).sort();
const cjsExports = Object.keys(cjs).sort();
if (JSON.stringify(esmExports) !== JSON.stringify(cjsExports)) {
  throw new Error("ESM and CJS public exports do not match");
}
if (!fs.statSync(path.join(root, "style/index.css")).size) {
  throw new Error("Built CSS entry is empty");
}

console.log(
  `Package check passed (${pack.files.length} files, ${esmExports.length} matching ESM/CJS exports).`
);
