import { fireEvent, render, waitFor, type RenderResult } from "@testing-library/react";
import { type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import Drawer from "../components/drawer";
import Modal, { ModalPanel } from "../components/modal/modal";

/**
 * Modal / Drawer 的关闭销毁契约（destroyOnClose 默认 true）：关窗后要等退场倒计时（300ms）跑完，
 * 整棵 .k-modal / .k-drawer 才从 DOM 摘掉，重开时重新挂载；传 destroyOnClose=false 才留一份隐藏 DOM，
 * 里面填过的表单状态才保得住（React 侧靠 Transition 的 unmountOnExit 跟着同一个开关）。
 * panelOnly 是宿主浮层里的面板，生命周期归宿主，任何时候都不销毁。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal-destroy-on-close.test.ts。
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// 打开：effect 里排了 setTimeout(0)，再给退场/进场动画留点余量
const afterOpen = () => sleep(120);
// 销毁发生在 300ms 倒计时结束时。正向断言用轮询，别把边界掐死在 CI 抖动里。
const gone = (sel: string) => waitFor(() => expect(document.querySelector(sel)).toBeNull());

let view: RenderResult | null = null;

const renderView = (element: ReactElement) => {
  view = render(element);
  return view;
};

const modal = (open: boolean, props: Record<string, unknown> = {}) => (
  <Modal open={open} title="标题" {...props}>
    <input />
  </Modal>
);

const drawer = (open: boolean, props: Record<string, unknown> = {}) => (
  <Drawer open={open} {...props}>
    <input />
  </Drawer>
);

afterEach(() => {
  view?.unmount();
  view = null;
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
});

describe("Modal destroy on close", () => {
  it("destroys the dialog DOM once the exit countdown is over", async () => {
    renderView(modal(true));
    await afterOpen();
    expect(document.querySelector(".k-modal")).not.toBeNull();

    view?.rerender(modal(false));
    await gone(".k-modal");

    // 销毁不该把滚动锁留下
    expect(document.body.classList.contains("k-scroll-locked")).toBe(false);
  });

  it("keeps the dialog DOM and the typed value with destroyOnClose=false", async () => {
    renderView(modal(true, { destroyOnClose: false }));
    await afterOpen();
    const input = document.querySelector("input")!;
    fireEvent.change(input, { target: { value: "填过的" } });

    view?.rerender(modal(false, { destroyOnClose: false }));
    await sleep(450);
    expect(document.querySelector(".k-modal")).not.toBeNull();

    view?.rerender(modal(true, { destroyOnClose: false }));
    await afterOpen();
    // 同一批节点：隐藏而非销毁，所以用户填的东西还在
    expect(document.querySelector("input")).toBe(input);
    expect(input.value).toBe("填过的");
  });

  it("remounts fresh content when reopening after a destroy", async () => {
    renderView(modal(true));
    await afterOpen();
    const first = document.querySelector("input")!;
    fireEvent.change(first, { target: { value: "填过的" } });

    view?.rerender(modal(false));
    await gone(".k-modal");
    view?.rerender(modal(true));
    await afterOpen();

    const second = document.querySelector("input")!;
    expect(second).not.toBe(first);
    expect(second.value).toBe("");
  });

  it("keeps a dialog reopened before the exit countdown fires", async () => {
    renderView(modal(true));
    await afterOpen();
    const root = document.querySelector(".k-modal")!;
    const input = document.querySelector<HTMLInputElement>(".k-modal-body input")!;
    input.value = "填过的";

    view?.rerender(modal(false));
    await sleep(30); // 倒计时还没跑完就反悔（窗口留足余量，别让 CI 抖动写成假失败）
    view?.rerender(modal(true));
    await sleep(600); // 跨过原来那次关闭的 300ms 边界

    // 反悔不该走一遍"销毁再重挂"：面板从头到尾没消失过，填过的内容也还在。
    // （光断言 .k-modal 还在不行——受控的 open 仍是 true，effect 会把它自己救回来。）
    expect(document.querySelector(".k-modal")).toBe(root);
    expect(document.querySelector("input")).toBe(input);
    expect(input.value).toBe("填过的");
  });

  it("keeps panelOnly inline and never destroys it", async () => {
    const mounted = renderView(
      <ModalPanel title="标题">
        <input />
      </ModalPanel>,
    );
    await sleep(450);

    // panelOnly 归宿主：留在容器里，不搬去 body，也不带遮罩
    const panel = mounted.container.querySelector(".k-modal");
    expect(panel).not.toBeNull();
    expect(panel?.classList.contains("k-modal-panel")).toBe(true);
    expect(panel?.querySelector(".k-modal-mask")).toBeNull();
    expect(panel?.querySelector('[role="dialog"]')?.hasAttribute("aria-modal")).toBe(false);
  });
});

describe("Drawer destroy on close", () => {
  it("destroys the drawer DOM once the exit countdown is over", async () => {
    renderView(drawer(true));
    await afterOpen();
    expect(document.querySelector(".k-drawer")).not.toBeNull();

    view?.rerender(drawer(false));
    await gone(".k-drawer");
    expect(document.body.classList.contains("k-scroll-locked")).toBe(false);
  });

  it("keeps a drawer reopened before the exit countdown fires", async () => {
    renderView(drawer(true));
    await afterOpen();
    const root = document.querySelector(".k-drawer")!;
    const input = document.querySelector<HTMLInputElement>(".k-drawer-body input")!;
    input.value = "填过的";

    view?.rerender(drawer(false));
    await sleep(30);
    view?.rerender(drawer(true));
    await sleep(600);

    // 同 Modal：反悔不该走一遍销毁重挂
    expect(document.querySelector(".k-drawer")).toBe(root);
    expect(document.querySelector("input")).toBe(input);
    expect(input.value).toBe("填过的");
  });

  it("keeps the drawer DOM and the typed value with destroyOnClose=false", async () => {
    renderView(drawer(true, { destroyOnClose: false }));
    await afterOpen();
    const input = document.querySelector("input")!;
    fireEvent.change(input, { target: { value: "填过的" } });

    view?.rerender(drawer(false, { destroyOnClose: false }));
    await sleep(450);
    expect(document.querySelector(".k-drawer")).not.toBeNull();

    view?.rerender(drawer(true, { destroyOnClose: false }));
    await afterOpen();
    expect(document.querySelector("input")).toBe(input);
    expect(input.value).toBe("填过的");
  });
});
