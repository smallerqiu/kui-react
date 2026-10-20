import { render } from "@testing-library/react";
import fs from "node:fs/promises";
import path from "node:path";
import less from "less";
import { describe, expect, it } from "vitest";
import { colors } from "../components/const/var";
import { Tag } from "../components";

const tagOf = (container: HTMLElement) => container.querySelector(".k-tag");
const classesOf = (container: HTMLElement) => [...(tagOf(container)?.classList ?? [])];
const inlineBackground = (element: Element | null) =>
  (element?.getAttribute("style") ?? "").includes("background-color");

// The palette's neutral slot: it takes the greys the theme re-maps instead of a tint of a hue, so its
// declarations differ from the other sixteen on purpose.
const NEUTRAL = ["gray"];

describe("Tag color vocabulary", () => {
  it("paints from a preset name through the palette, not an inline value", () => {
    const { container } = render(<Tag color="blue">blue</Tag>);

    // 预设名走色板：换个主题只改 token，写死在 style 里的颜色永远改不动
    expect(classesOf(container)).toContain("k-tag-blue");
    expect(inlineBackground(tagOf(container))).toBe(false);
  });

  it("prefers the palette when a preset name is also a CSS color keyword", () => {
    const { container } = render(<Tag color="gray">gray</Tag>);

    // `gray` 既能被浏览器读成颜色，也是色板里的一个名字 ⇒ 名字优先，否则拿到的是浏览器的灰
    expect(classesOf(container)).toContain("k-tag-gray");
    expect(inlineBackground(tagOf(container))).toBe(false);
  });

  it("reads a colour the browser understands as a custom colour", () => {
    const { container } = render(<Tag color="tomato">tomato</Tag>);

    // 色板之外的可读色走内联那条臂，而不是拼成一个没人定义过的类名
    expect(tagOf(container)?.getAttribute("style")).toContain("tomato");
    expect(classesOf(container)).toContain("k-tag-has-color");
    expect(classesOf(container)).not.toContain("k-tag-tomato");
  });

  it("keeps a hex colour inline", () => {
    const { container } = render(<Tag color="#f0f0f0">#f0f0f0</Tag>);

    expect(tagOf(container)?.getAttribute("style")).toContain("rgb(240, 240, 240)");
    expect(classesOf(container)).not.toContain("k-tag-f0f0f0");
  });

  it("paints nothing when the colour string is neither a name nor a colour", () => {
    const { container } = render(<Tag color="brand-blue">brand-blue</Tag>);

    // 两边都不认时标签回到 `theme` 的表面：发一个没有规则定义的类名只会画一个不存在的颜色
    expect(classesOf(container)).not.toContain("k-tag-brand-blue");
    expect(inlineBackground(tagOf(container))).toBe(false);
  });

  it("keeps its tier class next to a colour", () => {
    const { container } = render(
      <Tag color="blue" theme="solid">
        blue
      </Tag>,
    );

    // 档与颜色各发各的类名，谁压住谁由样式表的书写顺序决定，见下面那条
    expect(classesOf(container)).toContain("k-tag-solid");
    expect(classesOf(container)).toContain("k-tag-blue");
  });

  it("reads `default` as no colour at all, not as a palette name", () => {
    const withName = render(<Tag color="default">default</Tag>);
    const without = render(<Tag>default</Tag>);

    // 不传 color 用的就是组件自己的那张表面 ⇒ `default` 不再占一个色板名字，写了它和没写一样
    expect(classesOf(withName.container)).not.toContain("k-tag-default");
    expect(inlineBackground(tagOf(withName.container))).toBe(false);
    expect(classesOf(withName.container)).toEqual(classesOf(without.container));
  });
});

describe("Tag palette coverage", () => {
  const root = path.resolve(import.meta.dirname, "..");

  // Flatten the compiled sheet into `selector -> declarations`, whitespace-normalised, and keep the
  // order the rules came out in. Reading values is what catches a copy-paste that points the wrong
  // token at a palette name; reading order is what catches a colour losing the (0,2,0) tie to a tier.
  const sheet = async () => {
    const filename = path.join(root, "components/tag/styles/index.less");
    const css = (await less.render(await fs.readFile(filename, "utf8"), { filename })).css;
    const entries = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
      (match) =>
        [
          (match[1].split("}").pop() ?? "").replace(/\s+/g, " ").trim(),
          match[2].replace(/\s+/g, " ").trim().replace(/;$/, ""),
        ] as const,
    );
    return { rules: new Map(entries), selectors: entries.map(([selector]) => selector) };
  };

  const painted = (name: string) =>
    NEUTRAL.includes(name)
      ? "color: var(--kui-color-text); border-color: var(--kui-color-border); background-color: var(--kui-color-bg-2)"
      : `color: var(--kui-color-${name}-3, color-mix(in srgb, var(--kui-color-${name}) 70%, transparent)); ` +
        `border-color: var(--kui-color-${name}-6, color-mix(in srgb, var(--kui-color-${name}) 40%, transparent)); ` +
        `background-color: var(--kui-color-${name}-9, color-mix(in srgb, var(--kui-color-${name}) 10%, transparent))`;

  it("every palette name paints the chip with its own token", async () => {
    const { rules } = await sheet();

    // 色板加了名字而标签的样式表忘了跟进，这里就红：组件认这个名字，样式表不认
    for (const name of colors) {
      expect(rules.get(`.k-tag.k-tag-${name}`), `.k-tag.k-tag-${name}`).toBe(painted(name));
    }
  });

  it("keeps `default` out of the stylesheet", async () => {
    const { rules } = await sheet();

    // 组件不再发 `k-tag-default`，样式表也不该留一条没人调用的颜色档
    expect(rules.has(".k-tag.k-tag-default"), ".k-tag.k-tag-default").toBe(false);
  });

  it("lets a colour outrank the tier it is written next to", async () => {
    const { selectors } = await sheet();
    const indexOf = (name: string) => selectors.indexOf(`.k-tag.k-tag-${name}`);

    // 两者都是 (0,2,0)，谁赢只看书写顺序 ⇒ 颜色必须排在每一档之后，否则 `color` 会被 `theme` 重新画过
    for (const tier of ["fill", "outline", "plain", "solid", "dashed"]) {
      expect(indexOf(tier), `.k-tag-${tier} 必须排在颜色之前`).toBeLessThan(indexOf("blue"));
    }
  });

  it("shows every palette name in the colorful demo", async () => {
    const demo = await fs.readFile(path.join(root, "components/tag/demo/color.tsx"), "utf8");

    for (const name of colors) {
      expect(demo.includes(`"${name}"`), `${name} 没出现在多彩 demo 里`).toBe(true);
    }
  });

  it("counts the palette the way the docs do", async () => {
    const zh = await fs.readFile(path.join(root, "components/tag/index.md"), "utf8");
    const en = await fs.readFile(path.join(root, "components/tag/index.en_US.md"), "utf8");

    // 色板改名字，文档里那句"同一套 N 个"也得跟着改，不然写的是数量、画的是另一套
    expect(zh.includes(`共用同一套 ${colors.length} 个`), "index.md 的色板数量").toBe(true);
    expect(en.includes(`the same ${colors.length} \`Badge\` uses`), "index.en_US.md 的数量").toBe(
      true,
    );
  });
});
