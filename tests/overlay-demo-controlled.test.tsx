import { fireEvent, render, waitFor } from "@testing-library/react";
import { type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import DrawerBasic from "../components/drawer/demo/basic";
import DrawerCustom from "../components/drawer/demo/custom";
import DrawerTarget from "../components/drawer/demo/target";
import DrawerWithForm from "../components/drawer/demo/with-form";
import FormWithModal from "../components/form/demo/withmodal";
import ModalBasic from "../components/modal/demo/basic";
import ModalCustom from "../components/modal/demo/custom";
import ModalMore from "../components/modal/demo/more";
import WatermarkInOverlay from "../components/watermark/demo/in-modal-drawer";

/**
 * 文档示例里的受控写法契约。
 *
 * `Modal` / `Drawer` 的底部「取消」只触发 `onCancel`，不走 `onClose`。示例若把 `useState` 的回写挂在
 * `onClose` 上，点取消关掉的那一次状态还停在 `true`，再点触发按钮就再也打不开了。
 * 这里把每个示例的触发按钮都走一遍「打开 → 取消 → 再打开」，示例改坏了会在这里红。
 * 单向受控的 React 侧走 `onOpenChange`；Vue 侧是 `v-model` 双向绑定，见 kui-vue 同名用例。
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const panel = () => document.querySelector(".k-modal, .k-drawer");
// 打开：effect 里排了 setTimeout(0)，给进场动画留点余量。
const afterOpen = () => sleep(120);
// destroyOnClose 默认 true：300ms 退场倒计时结束后面板节点才摘掉。
const gone = () => waitFor(() => expect(panel()).toBeNull(), { timeout: 3000 });
// 关闭入口：优先底部「取消」（这条路径不触发 onClose，最容易漏回写），没有就点右上角叉号。
const dismissIn = (dialog: Element) =>
  [...dialog.querySelectorAll("button")].find((button) =>
    /取消|cancel/i.test(button.textContent ?? ""),
  ) ?? dialog.querySelector(".k-modal-close, .k-drawer-close");

const cases: [string, ReactElement][] = [
  ["Modal 基本用法", <ModalBasic key="a" />],
  ["Modal 自定义", <ModalCustom key="b" />],
  ["Modal 其它属性", <ModalMore key="c" />],
  ["Drawer 基本用法", <DrawerBasic key="d" />],
  ["Drawer 自定义", <DrawerCustom key="e" />],
  ["Drawer 指定容器", <DrawerTarget key="f" />],
  ["Drawer 带表单", <DrawerWithForm key="g" />],
  ["Form 弹窗新增", <FormWithModal key="h" />],
  ["Watermark 弹窗与抽屉", <WatermarkInOverlay key="i" />],
];

let view: ReturnType<typeof render> | null = null;

afterEach(() => {
  view?.unmount();
  view = null;
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
});

describe.each(cases)("%s", (_name, element) => {
  it("每个触发按钮都能开、点「取消」关掉后还能再开", async () => {
    view = render(element);
    const triggers = [...view.container.querySelectorAll("button")];
    let opened = 0;
    for (const trigger of triggers) {
      fireEvent.click(trigger);
      await afterOpen();
      const dialog = panel();
      // 这个按钮不开窗（Segmented 的选项、表单自己的提交按钮等）。
      if (!dialog) continue;
      opened += 1;
      const dismiss = dismissIn(dialog);
      expect(dismiss, `${_name}：面板里没有可点的关闭入口`).not.toBeNull();
      fireEvent.click(dismiss as HTMLElement);
      await gone();
      fireEvent.click(trigger);
      await afterOpen();
      const reopened = panel();
      expect(reopened, `${_name}：「${trigger.textContent}」关掉后再点打不开`).not.toBeNull();
      const again = dismissIn(reopened as Element);
      expect(again, `${_name}：「${trigger.textContent}」重新打开后没有关闭入口`).not.toBeNull();
      fireEvent.click(again as HTMLElement);
      await gone();
    }
    expect(opened, `${_name}：一个窗口都没打开，用例本身失配`).toBeGreaterThan(0);
    // 一次「打开 → 取消 → 再打开 → 再取消」就要等进场 effect 和 300ms 退场倒计时，
    // 按钮多的示例（自定义、其它属性）要跑十几轮，默认 5s 不够。
  }, 60_000);
});
