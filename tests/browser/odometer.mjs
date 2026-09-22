import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
import { chromium } from "@playwright/test";

// node tests/browser/odometer.mjs ../kui-react ../kui-vue
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage();
  for (const repository of process.argv.slice(2)) {
    const source = fs.readFileSync(
      path.join(repository, "components/stat-card/utils/odometer.ts"),
      "utf8",
    );
    const js = ts
      .transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
      })
      .outputText.replace("export class Odometer", "window.Odometer = class Odometer");
    await page.setContent('<div id="number" style="font:36px monospace"></div>');
    await page.addScriptTag({ content: js });
    for (const [from, to] of [
      [12345, 54321],
      [54321, 12345],
    ]) {
      await page.evaluate(
        ([from, to]) => {
          window.roll?.destroy();
          window.roll = new window.Odometer({ duration: 0.8, mode: "continuous" });
          const element = document.querySelector("#number");
          window.roll.render(element, from.toLocaleString("en-US"), from);
          window.roll.render(element, to.toLocaleString("en-US"), to);
        },
        [from, to],
      );
      const tracks = page.locator(".odometer-track");
      assert.equal(await tracks.count(), 4);
      assert.deepEqual(
        await tracks.evaluateAll((elements) =>
          elements.map((element) => element.dataset.direction),
        ),
        to > from ? ["up", "up", "down", "down"] : ["down", "down", "up", "up"],
      );
      const offset = () =>
        tracks.last().evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42);
      await page.waitForTimeout(100);
      const first = await offset();
      await page.waitForTimeout(180);
      const second = await offset();
      assert.ok(to > from ? second > first : second < first);
      assert.ok(Math.abs(second - first) > 36, "must scroll more than a single digit");
      await page.waitForTimeout(650);
      assert.equal(await page.locator("#number").innerText(), to.toLocaleString("en-US"));
      assert.equal(await tracks.count(), 0);
      console.log({ repository, from, to, first, second });
    }
  }
} finally {
  await browser.close();
}
