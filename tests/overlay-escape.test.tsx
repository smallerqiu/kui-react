import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Drawer from "../components/drawer";
import Modal from "../components/modal/modal";
import Popup from "../components/popup";

/**
 * Escape 的归属契约：一次按键只关最上面那一层；已经关上的、panelOnly 的、escKey=false 的窗口
 * 都不该抢走这次按键。遮罩层（Modal / Drawer）和弹层（Popup）共用同一个顺序时钟，
 * 所以下拉压在 Modal 上时，第一次 Escape 归下拉，Modal 保持打开（滚动锁还在就是没关）。
 * 两个仓库断言同一件事，见 kui-vue/tests/overlay-escape.test.ts。
 */

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 80));
};

const pressEscape = () => {
  fireEvent.keyDown(document, { key: "Escape" });
};

// 打开着的遮罩层都锁着页面滚动，用它当"这层还开着"的判据
const stillOpen = () => document.body.classList.contains("k-scroll-locked");

let views: ReturnType<typeof render>[] = [];

const track = <T extends ReturnType<typeof render>>(view: T) => {
  views.push(view);
  return view;
};

afterEach(() => {
  views.forEach((view) => view.unmount());
  views = [];
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
});

const openModal = (props: Record<string, unknown> = {}) =>
  track(
    render(
      <Modal open title="标题" {...props}>
        <span>内容</span>
      </Modal>,
    ),
  );

describe("Escape closes only the topmost overlay", () => {
  it("leaves the modal below alone", async () => {
    const outer = { onClose: vi.fn(), title: "外层" };
    const inner = { onClose: vi.fn(), title: "内层" };
    openModal(outer);
    await settle();
    openModal(inner);
    await settle();

    pressEscape();
    await settle();
    expect(inner.onClose).toHaveBeenCalledTimes(1);
    expect(outer.onClose).not.toHaveBeenCalled();
    expect(stillOpen()).toBe(true);

    pressEscape();
    await settle();
    expect(outer.onClose).toHaveBeenCalledTimes(1);
    expect(stillOpen()).toBe(false);
  });

  it("prefers the modal over the drawer opened before it", async () => {
    const drawerClose = vi.fn();
    track(
      render(
        <Drawer open onClose={drawerClose}>
          <span>抽屉</span>
        </Drawer>,
      ),
    );
    await settle();
    const modalClose = vi.fn();
    openModal({ onClose: modalClose });
    await settle();

    pressEscape();
    await settle();
    expect(modalClose).toHaveBeenCalledTimes(1);
    expect(drawerClose).not.toHaveBeenCalled();
  });

  it("yields to a popup opened above the modal", async () => {
    const onClose = vi.fn();
    openModal({ onClose });
    await settle();
    const popup = track(
      render(
        <Popup open overlay="下拉内容">
          <button>触发</button>
        </Popup>,
      ),
    );
    await settle();

    pressEscape();
    await settle();
    expect(onClose).not.toHaveBeenCalled();
    expect(stillOpen()).toBe(true);

    popup.unmount();
    views.splice(views.indexOf(popup), 1);
    await settle();
    pressEscape();
    await settle();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores a modal that is already closed", async () => {
    const onClose = vi.fn();
    const view = openModal({ onClose });
    await settle();
    view.rerender(
      <Modal open={false} title="标题" onClose={onClose}>
        <span>内容</span>
      </Modal>,
    );
    await settle();

    pressEscape();
    await settle();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ignores a panelOnly modal", async () => {
    const onClose = vi.fn();
    openModal({ onClose, panelOnly: true, open: undefined });
    await settle();

    pressEscape();
    await settle();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("stops listening while escKey is off and resumes when it is back on", async () => {
    const onClose = vi.fn();
    const view = openModal({ onClose, escKey: false });
    await settle();

    pressEscape();
    await settle();
    expect(onClose).not.toHaveBeenCalled();

    view.rerender(
      <Modal open title="标题" escKey onClose={onClose}>
        <span>内容</span>
      </Modal>,
    );
    await settle();
    pressEscape();
    await settle();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
