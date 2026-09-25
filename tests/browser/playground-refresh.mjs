import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

// Start the docs server, then pass its origin (defaults to the docs dev port).
const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${process.argv[2] || "http://127.0.0.1:7006"}/playground`);
  const code = 'export default function App() { return <div>Refresh preview</div>; }';
  await page.evaluate((source) => {
    sessionStorage.setItem("kui-playground-code", JSON.stringify({ ts: source, js: source, language: "ts" }));
  }, code);
  for (const width of [1200, 780, 700, 400, 1000]) {
    await page.setViewportSize({ width, height: 800 });
    await page.reload();
    await expect(page.locator(".k-content")).toHaveText("Refresh preview");
    await expect(page.locator(".k-code")).toHaveText(code);
    await expect.poll(async () => page.locator(".k-code").evaluate((editor) => {
      const rect = editor.getBoundingClientRect();
      const parent = editor.parentElement.getBoundingClientRect();
      return rect.width > 100 && rect.height > 80 && rect.top >= 0 && rect.bottom <= innerHeight + 1
        && rect.top >= parent.top && rect.bottom <= parent.bottom + 1;
    })).toBe(true);
    const horizontal = width >= 800;
    await expect(page.locator(".k-demo")).toHaveClass(horizontal ? /k-demo-horizontal/ : /k-demo-vertical/);
  }
  assert.deepEqual(errors, []);
  console.log("Playground refresh: saved source, compiled UI, and visible editor verified at five widths.");
} finally { await browser.close(); }
