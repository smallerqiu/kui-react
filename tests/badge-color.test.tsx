import { render } from "@testing-library/react";
import fs from "node:fs/promises";
import path from "node:path";
import less from "less";
import { describe, expect, it } from "vitest";
import { colors } from "../components/const/var";
import { Badge } from "../components";

const dotOf = (container: HTMLElement) => container.querySelector(".k-badge-status-dot");
const supOf = (container: HTMLElement) => container.querySelector("sup");
const inlineBackground = (element: Element | null) =>
  (element?.getAttribute("style") ?? "").includes("background-color");
// A bubble's own classes are the part it is and the marker that it has no child to sit on. Anything
// else on it was painted from a `color` string, and only a palette name may do that.
const paintClasses = (element: Element | null) =>
  (element?.getAttribute("class") ?? "")
    .split(/\s+/)
    .filter((cls) => cls.startsWith("k-badge-"))
    .filter((cls) => !["k-badge-count", "k-badge-dot", "k-badge-no-child"].includes(cls));

describe("Badge color vocabulary", () => {
  it("paints a status dot from a preset name through the palette, not an inline value", () => {
    const { container } = render(<Badge color="blue" />);

    // 预设名走色板：换个档只改 token，写死在 style 里的颜色永远改不动
    expect(dotOf(container)?.className).toContain("k-badge-status-blue");
    expect(inlineBackground(dotOf(container))).toBe(false);
  });

  it("prefers the palette when a preset name is also a CSS color keyword", () => {
    const { container } = render(<Badge color="gray" />);

    // `gray` 既能被浏览器读成颜色，也是色板里的一个名字 ⇒ 名字优先，否则拿到的是浏览器的灰
    expect(dotOf(container)?.className).toContain("k-badge-status-gray");
    expect(inlineBackground(dotOf(container))).toBe(false);
  });

  it("lets the requested colour paint over the semantic status", () => {
    const { container } = render(<Badge status="success" color="blue" />);

    expect(dotOf(container)?.className).toContain("k-badge-status-blue");
    expect(dotOf(container)?.className).not.toContain("k-badge-status-success");
  });

  it("reads a colour the browser understands as a custom colour", () => {
    const { container } = render(<Badge color="tomato" />);

    // 色板之外的可读色走内联那条臂，而不是拼成一个没人定义过的类名
    expect(dotOf(container)?.getAttribute("style")).toContain("tomato");
    expect(dotOf(container)?.className).not.toContain("k-badge-status-tomato");
  });

  it("falls back to the status slot when the colour string is neither", () => {
    const { container } = render(<Badge color="brand-blue" />);

    // 两边都不认时得有个没人定义的类名之外可去：发 `k-badge-status-brand-blue` 画的是一颗透明的点
    expect(dotOf(container)?.className).toContain("k-badge-status-default");
    expect(dotOf(container)?.className).not.toContain("k-badge-status-brand-blue");
    expect(inlineBackground(dotOf(container))).toBe(false);
  });

  it("reads `default` as no colour, so the bubble keeps its own paint", () => {
    const { container } = render(<Badge count={5} color="default" />);

    // `default` 不再占色板名字 ⇒ 数字气泡回到 `.k-badge-count` 自己那张主色表面，而不是被染灰
    expect(paintClasses(supOf(container))).toEqual([]);
    expect(inlineBackground(supOf(container))).toBe(false);
  });

  it("still paints the neutral dot when a caller asks for it by name", () => {
    const { container } = render(<Badge color="default" />);

    // 那颗灰点是 `status` 的档，不是色板的名字 ⇒ 状态点在色板之外也得有地方可落
    expect(dotOf(container)?.className).toContain("k-badge-status-default");
    expect(inlineBackground(dotOf(container))).toBe(false);
  });

  it("carries a preset name onto the count bubble", () => {
    const { container } = render(<Badge count={5} color="blue" />);

    expect(supOf(container)?.className).toContain("k-badge-count");
    expect(supOf(container)?.className).toContain("k-badge-blue");
    expect(inlineBackground(supOf(container))).toBe(false);
  });

  it("carries a preset name onto the dot bubble", () => {
    const { container } = render(<Badge dot color="blue" />);

    expect(supOf(container)?.className).toContain("k-badge-dot");
    expect(supOf(container)?.className).toContain("k-badge-blue");
  });

  it("keeps a custom colour inline on the count bubble", () => {
    const { container } = render(<Badge count={5} color="#f0f0f0" />);

    expect(supOf(container)?.getAttribute("style")).toContain("rgb(240, 240, 240)");
    expect(paintClasses(supOf(container))).toEqual([]);
  });

  it("does not paint the count bubble with a status name", () => {
    const { container } = render(<Badge count={5} status="success" />);

    // 数字气泡的颜色由 `.k-badge-count` 自己定，状态档只管那颗点 —— 发一个没有规则定义的类名只会留个空壳
    expect(supOf(container)?.className).not.toContain("k-badge-success");
    expect(inlineBackground(supOf(container))).toBe(false);
  });
});

describe("Badge palette coverage", () => {
  const root = path.resolve(import.meta.dirname, "..");

  // Flatten the compiled sheet into `selector -> declarations`, whitespace-normalised, so a rule can be
  // read for its value instead of its name: a copy-paste that points the wrong token at a palette name
  // still has every selector, and only this comparison sees it.
  const rules = async () => {
    const filename = path.join(root, "components/badge/styles/index.less");
    const css = (await less.render(await fs.readFile(filename, "utf8"), { filename })).css;
    return new Map(
      [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => [
        (match[1].split("}").pop() ?? "").replace(/\s+/g, " ").trim(),
        match[2].replace(/\s+/g, " ").trim().replace(/;$/, ""),
      ]),
    );
  };

  it("every palette name paints the dot and both bubbles with its own token", async () => {
    const compiled = await rules();

    // 色板加了名字而徽标忘了跟进，这里就红：组件认这个名字，样式表不认
    for (const name of colors) {
      const painted = `background-color: var(--kui-color-${name})`;
      expect(compiled.get(`.k-badge-status-${name}`), `.k-badge-status-${name}`).toBe(painted);
      expect(
        compiled.get(`.k-badge-count.k-badge-${name}, .k-badge-dot.k-badge-${name}`),
        `气泡 .k-badge-${name}`,
      ).toBe(painted);
    }
  });

  it("keeps the neutral dot under `status` and out of the bubbles", async () => {
    const compiled = await rules();

    // 灰点属于 `status` 那一档：想点个不表态的点总得有个颜色可落，它不是色板里的名字
    expect(compiled.get(".k-badge-status-default"), ".k-badge-status-default").toBe(
      "background-color: var(--kui-color-border-disabled)",
    );
    // 气泡不该再被 `default` 染灰 —— 色板没有这个名字，组件也就不发这个类
    expect(
      compiled.has(".k-badge-count.k-badge-default, .k-badge-dot.k-badge-default"),
      "气泡 .k-badge-default",
    ).toBe(false);
  });

  it("shows every palette name in the colorful demo", async () => {
    const demo = await fs.readFile(path.join(root, "components/badge/demo/color.tsx"), "utf8");

    for (const name of colors) {
      expect(demo.includes(`"${name}"`), `${name} 没出现在多彩 demo 里`).toBe(true);
    }
  });
});
