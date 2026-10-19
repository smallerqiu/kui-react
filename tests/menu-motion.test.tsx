import fs from "node:fs/promises";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import less from "less";
import { describe, expect, it } from "vitest";
import { Menu, MenuItem, SubMenu } from "../components/menu";

// 纵向子菜单的高度动画必须只归 Menu 自己，不许借用 Collapse 的 `k-collapse-slide`：同一个元素上会叠
// 两套动画——Menu 的 height 过渡 + Collapse 那条规则里的 `animation: k-motion-scale-y-in`（scaleY 0→1）。
// 盒子按布局高度先撑开，内容还被压成 0，看上去就是"外层先展开、里面的再伸缩下来"。
const menuLess = async () => {
  const filename = path.resolve(import.meta.dirname, "../components/menu/styles/index.less");
  const { css } = await less.render(await fs.readFile(filename, "utf8"), { filename });
  // 注释不参与类名检查。
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
};

describe("Inline submenu expansion motion", () => {
  it("animates on Menu's own transition classes", async () => {
    render(
      <Menu mode="inline">
        <SubMenu itemKey="root" title="Root">
          <MenuItem itemKey="leaf">Leaf</MenuItem>
        </SubMenu>
      </Menu>,
    );
    fireEvent.click(screen.getByText("Root"));

    const seen: string[] = [];
    const collect = () => {
      const sub = document.querySelector<HTMLElement>(".k-menu-submenu-sub");
      if (sub) seen.push(sub.className);
    };
    collect();
    for (let frame = 0; frame < 6; frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      collect();
    }

    expect(seen.length).toBeGreaterThan(0);
    expect(seen.join(" ")).toContain("k-menu-slide-enter");
    expect(seen.join(" ")).not.toContain("k-collapse-slide");
  });

  it("single-sources the duration the transition timeout is matched to", async () => {
    const css = await menuLess();
    const source = await fs.readFile(
      path.resolve(import.meta.dirname, "../components/menu/sub-menu.tsx"),
      "utf8",
    );

    expect(css).not.toContain("k-collapse-slide");
    // 展开/收起分支是 Menu 里唯一的 `getTransitionProp` 调用点，它只能是 `k-menu-slide`。
    expect(source.match(/getTransitionProp\("[^"]+"\)/g)).toEqual([
      'getTransitionProp("k-menu-slide")',
    ]);

    const active = css.match(/\.k-menu-slide-enter-active[\s\S]*?\{([^}]*)\}/)?.[1] ?? "";
    const seconds = Number(active.match(/height\s+([\d.]+)s/)?.[1]);
    const timeout = Number(
      source.match(/getTransitionProp\("k-menu-slide"\), timeout: (\d+)/)?.[1],
    );
    expect(seconds).toBeGreaterThan(0);
    // 过渡时长与 react-transition-group 摘掉 `-enter-active` 的时机必须是同一个数：
    // JS 比 CSS 长会多留一段固定高度 + `overflow: hidden`，比 CSS 短会把动画掐断。
    expect(timeout).toBe(seconds * 1000);

    // 展开元素自己不许常驻一条 transition：`.k-menu-inline .k-menu-submenu-sub` (0,2,0)
    // 压过单类的 `-active` 规则，会让动画跑在一个时长上、在另一个时长上被拆掉。
    const sub = css.match(/\.k-menu-inline \.k-menu-submenu-sub\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(sub).not.toContain("transition");
    expect(sub).toContain("overflow: hidden");
  });
});
