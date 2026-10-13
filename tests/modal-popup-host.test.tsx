import { fireEvent, render, waitFor, type RenderResult } from "@testing-library/react";
import { type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Drawer from "../components/drawer";
import { Menu } from "../components/menu";
import Modal from "../components/modal/modal";
import { Select } from "../components/select";

/**
 * 宿主窗口（Modal / Drawer）关掉时，窗口里那些 teleported 到 body 的浮层必须跟着收掉：
 * 面板不在窗口 DOM 里，窗口摘了它还飘在页面上（Vue 侧同一套机制见 components/config/popup-host.ts）。
 *
 * 用例都走"受控 open 直接翻成 false"这条路径，不用 Escape、也不点关闭按钮：
 * 下拉自己会响应 Escape，点窗口里任何地方又会被当成外部点击把面板关掉——那两种关法
 * 不靠 popup-host 也能过，等于没测到东西。destroyOnClose=false 是为了让"节点被卸载"
 * 也没法解释面板消失，只有 onOpenChange(false) 才是宿主帮忙关的证据。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal.test.ts、tests/drawer.test.ts。
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const afterOpen = () => sleep(120);

const selectItems = [{ label: "Alpha", value: "alpha" }];
const popupItems = [{ key: "root", title: "Root", children: [{ key: "leaf", title: "Leaf" }] }];

let view: RenderResult | null = null;

const renderView = (element: ReactElement) => {
  view = render(element);
  return view;
};

const modalWith = (open: boolean, child: ReactElement) => (
  <Modal open={open} title="宿主" footer={false} destroyOnClose={false}>
    {child}
  </Modal>
);

const drawerWith = (open: boolean, child: ReactElement) => (
  <Drawer open={open} destroyOnClose={false}>
    {child}
  </Drawer>
);

afterEach(() => {
  view?.unmount();
  view = null;
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
});

/** 点开下拉，等面板挂到 body 上 */
async function openDropdown() {
  fireEvent.click(document.querySelector(".k-select")!);
  await waitFor(() => expect(document.querySelector(".k-select-dropdown")).not.toBeNull());
}

describe("Modal 关窗连带收掉窗口里的浮层", () => {
  it("受控关窗时把窗口里的下拉一起关掉", async () => {
    const onOpenChange = vi.fn();
    const select = <Select options={selectItems} onOpenChange={onOpenChange} />;
    renderView(modalWith(true, select));
    await afterOpen();
    await openDropdown();
    onOpenChange.mockClear();

    view?.rerender(modalWith(false, select));
    await sleep(450);

    // 宿主替它按了关闭：面板自己没收到点击也没收到 Escape
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(document.querySelector(".k-select-dropdown")).toBeNull());
  });

  it("关窗不该把窗口里的子菜单面板留下", async () => {
    const onOpenChange = vi.fn();
    const menu = <Menu mode="vertical" openKeys={["root"]} items={popupItems} />;
    renderView(modalWith(true, menu));
    await afterOpen();
    await waitFor(() => expect(document.querySelector(".k-menu-submenu-popup")).not.toBeNull());

    view?.rerender(
      modalWith(
        false,
        <Menu mode="vertical" openKeys={["root"]} items={popupItems} onOpenChange={onOpenChange} />,
      ),
    );
    await sleep(450);

    expect(onOpenChange).toHaveBeenCalledWith([]);
    // 只看"折叠了没有"：面板节点在 react 会被摘掉，vue 那边是 v-show 留着，两边形状本来就不同。
    await waitFor(() =>
      expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
        0,
      ),
    );
  });
});

describe("Drawer 关抽屉连带收掉抽屉里的浮层", () => {
  it("关抽屉时把抽屉里的下拉一起关掉", async () => {
    const onOpenChange = vi.fn();
    const select = <Select options={selectItems} onOpenChange={onOpenChange} />;
    renderView(drawerWith(true, select));
    await afterOpen();
    await openDropdown();
    onOpenChange.mockClear();

    view?.rerender(drawerWith(false, select));
    await sleep(450);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(document.querySelector(".k-select-dropdown")).toBeNull());
  });

  it("关抽屉时收掉子菜单面板", async () => {
    const onOpenChange = vi.fn();
    renderView(drawerWith(true, <Menu mode="vertical" openKeys={["root"]} items={popupItems} />));
    await afterOpen();
    await waitFor(() => expect(document.querySelector(".k-menu-submenu-popup")).not.toBeNull());

    view?.rerender(
      drawerWith(
        false,
        <Menu mode="vertical" openKeys={["root"]} items={popupItems} onOpenChange={onOpenChange} />,
      ),
    );
    await sleep(450);

    expect(onOpenChange).toHaveBeenCalledWith([]);
    await waitFor(() =>
      expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
        0,
      ),
    );
  });
});
