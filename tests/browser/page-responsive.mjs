import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

// Start the fixture's Vite server, then pass one or more React/Vue fixture URLs.
const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
try {
  for (const url of process.argv.slice(2)) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 700 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(url);
    const root = page.locator(".k-page");
    const resize = async (width, layout) => {
      await page.locator("#container").evaluate((node, value) => { node.style.width = `${value}px`; }, width);
      await expect(root).toHaveAttribute("data-page-layout", layout);
      assert.ok(await root.evaluate((node) => node.scrollWidth <= node.clientWidth + 1), "pagination must not overflow");
      await expect(root.locator(".k-pager:visible")).toHaveCount(1);
    };
    await resize(1000, "full");
    await resize(650, "compact");
    await resize(320, "simple");
    await expect(root.locator(".k-page-sizer")).toBeVisible();
    await expect(root.locator(".k-page-number")).toBeHidden();
    await expect(root.locator(".k-page-options")).toBeHidden();
    await resize(180, "simple");
    await expect(page.locator("#changes")).toHaveText("0");
    await root.getByRole("button", { name: "Next page", exact: true }).click();
    await expect(page.locator("#changes")).toHaveText("1");
    await expect(root.locator('.k-pager:visible input')).toHaveValue("51");
    await resize(1000, "full");
    await expect(root.getByRole("button", { name: "Page 51", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.locator("#changes")).toHaveText("1");
    await page.locator("#responsive").click();
    await expect(root).not.toHaveClass(/k-page-responsive/);
    await page.locator("#container").evaluate((node) => { node.style.width = "220px"; });
    await expect(root.locator('[data-page-pager="full"]')).toBeVisible();
    await page.locator("#responsive").click();
    await expect(root).toHaveAttribute("data-page-layout", "simple");
    await resize(1000, "full");
    assert.deepEqual(errors, []);
    console.log(`Responsive Page browser checks passed: ${url}`);
    await page.close();
  }
} finally {
  await browser.close();
}
