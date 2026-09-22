import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
import less from "less";
import { chromium } from "@playwright/test";

// node tests/browser/badge-alignment.mjs ../kui-react ../kui-vue
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const repository of process.argv.slice(2)) {
    const filename = path.resolve(repository, "components/badge/styles/index.less");
    const { css } = await less.render(
      '@import "../../styles/base.less";\n' + fs.readFileSync(filename, "utf8"),
      { filename },
    );
    const source = fs.readFileSync(
      path.join(repository, "components/stat-card/utils/odometer.ts"),
      "utf8",
    );
    const js = ts
      .transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
      })
      .outputText.replace("export class Odometer", "window.Odometer = class Odometer");
    for (const font of ["Arial", "system-ui"]) {
      for (const attached of [false, true]) {
        await page.setContent(`<!doctype html><style>${css} body{padding:60px;font-family:${font}} .k-badge{margin:20px}.box{width:40px;height:40px}</style>
          <div class="k-badge">${attached ? '<div class="box"></div>' : ""}<sup id="badge" class="k-badge-count ${attached ? "" : "k-badge-no-child"}"><span id="number" class="k-roll-number">9</span></sup></div>
          <div class="k-badge">${attached ? '<div class="box"></div>' : ""}<sup id="reference" class="k-badge-count ${attached ? "" : "k-badge-no-child"}">9</sup></div>`);
        await page.addScriptTag({ content: js });
        await page.evaluate(() => {
          window.roll = new window.Odometer({ duration: 0.3 });
          window.roll.render(document.querySelector("#number"), "9", 9);
        });
        const check = async (phase) => {
          const delta = await page.evaluate(() => {
            const badge = document.querySelector("#badge").getBoundingClientRect();
            const number = document.querySelector(".odometer-numbers").getBoundingClientRect();
            return (number.top + number.bottom - badge.top - badge.bottom) / 2;
          });
          console.log({ repository, font, attached, phase, delta });
          assert.ok(Math.abs(delta) < 0.1, `digit viewport is off-center: ${delta}px`);
          if (!phase.startsWith("rolling")) {
            const baselineDelta = await page.evaluate(() => {
              const center = (rect) => (rect.top + rect.bottom) / 2;
              const offset = (text, badge) => {
                const range = document.createRange();
                range.selectNodeContents(document.querySelector(text));
                return (
                  center(range.getBoundingClientRect()) -
                  center(document.querySelector(badge).getBoundingClientRect())
                );
              };
              return offset(".odometer-numbers", "#badge") - offset("#reference", "#reference");
            });
            assert.ok(
              Math.abs(baselineDelta) < 0.1,
              `rolling and static digits have different baselines: ${baselineDelta}px`,
            );
          }
        };
        await check("initial");
        for (const value of [10, 9]) {
          await page.evaluate((value) => {
            document.querySelector("#reference").textContent = String(value);
            window.roll.render(document.querySelector("#number"), String(value), value);
          }, value);
          await page.waitForTimeout(100);
          await check(`rolling to ${value}`);
          await page.waitForTimeout(300);
          await check(`settled ${value}`);
        }
      }
    }
  }
} finally {
  await browser.close();
}
