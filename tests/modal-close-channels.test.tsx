import { fireEvent, render, waitFor, type RenderResult } from "@testing-library/react";
import { useState, type ComponentType, type ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import Drawer from "../components/drawer";
import Modal from "../components/modal/modal";

/**
 * 关闭动作的通道契约：底部「取消」只发 onCancel，遮罩 / Esc / 右上角只发 onClose，两条互不重叠；
 * 而 onOpenChange 四种关法都会发一次——这正是"受控值只挂 onOpenChange 就够，
 * 不必在 onCancel 和 onClose 里各 setOpen(false) 一次"的依据。
 * 宿主这里只在 onOpenChange 里 setOpen，用例最后等到 DOM 摘掉，
 * 证明除了这条通道没有别的路径能把窗口关掉。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal-close-channels.test.ts。
 */

type CloseProps = {
  open: boolean;
  title?: string;
  maskClosable?: boolean;
  onCancel?: () => void;
  onClose?: () => void;
  onOpenChange?: (next: boolean) => void;
  children?: ReactNode;
};

type Channels = { cancel: number; close: number; openChanges: boolean[]; log: string[] };

const views: RenderResult[] = [];

const harness = (Target: ComponentType<CloseProps>): Channels => {
  const channels: Channels = { cancel: 0, close: 0, openChanges: [], log: [] };
  function Host() {
    const [open, setOpen] = useState(true);
    return (
      <Target
        open={open}
        title="标题"
        maskClosable
        onCancel={() => {
          channels.cancel += 1;
          channels.log.push("cancel");
        }}
        onClose={() => {
          channels.close += 1;
          channels.log.push("close");
        }}
        onOpenChange={(next) => {
          channels.openChanges.push(next);
          channels.log.push(`open:${next}`);
          setOpen(next);
        }}
      >
        内容
      </Target>
    );
  }
  views.push(render(<Host />));
  return channels;
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 120));

const targets = [
  ["Modal", Modal, ".k-modal", ".k-modal-wrap"],
  ["Drawer", Drawer, ".k-drawer", ".k-drawer-mask"],
] as const;

describe.each(targets)("%s close channels", (_name, Target, root, maskSelector) => {
  const paths = [
    ["footer cancel", () => fireEvent.click(document.querySelector(`${root}-footer button`)!), "cancel"],
    ["mask", () => fireEvent.click(document.querySelector(maskSelector)!), "close"],
    [
      "Escape",
      () => fireEvent.keyDown(document, { key: "Escape" }),
      "close",
    ],
    ["corner close", () => fireEvent.click(document.querySelector(`${root}-close`)!), "close"],
  ] as const;

  describe.each(paths)("%s", (_label, action, channel) => {
    it(`fires ${channel} only, and reports the close once`, async () => {
      const channels = harness(Target);
      await settle();

      action();
      await settle();

      expect(channels.cancel, "footer cancel is the onCancel channel").toBe(
        channel === "cancel" ? 1 : 0,
      );
      expect(channels.close, "mask / Escape / corner are the onClose channel").toBe(
        channel === "close" ? 1 : 0,
      );
      expect(channels.openChanges.filter((next) => next === false)).toHaveLength(1);
      expect(channels.openChanges.at(-1)).toBe(false);
      // 四处（react/vue × Modal/Drawer）统一的顺序：先结开合状态，再发语义回调。
      // 反过来的话 onCancel/onClose 里读到 open 还是 true，宿主只能自己再补一次 setOpen。
      // 打开方向一个字都不发（见下面那组用例），所以整段日志就只有这两条。
      expect(channels.log).toEqual(["open:false", channel]);

      // 只靠 onOpenChange 同步受控值就能真的关掉窗口
      await waitFor(() => expect(document.querySelector(root)).toBeNull());
    });
  });
});

/**
 * 打开方向不回写：能走到"打开"的只有宿主把 `open` 翻成 true 这一条路（挂载时就是 true 也算），
 * 再发一次 `onOpenChange(true)` 是把宿主刚写过的值喂回去。vue 侧同口径——`modelValue` 翻 true
 * 时既不回写 `update:modelValue` 也不发 `openChange(true)`，见 kui-vue 的同名文件。
 */
describe.each(targets)("%s opening echoes nothing", (_name, Target, root) => {
  it.each([
    ["already open at mount", true],
    ["opened later by the host", false],
  ])("%s", async (_label, openAtMount) => {
    const log: string[] = [];
    function Host() {
      const [open, setOpen] = useState(openAtMount);
      return (
        <div>
          <button onClick={() => setOpen(true)}>打开</button>
          <Target
            open={open}
            title="标题"
            onOpenChange={(next) => {
              log.push(`open:${next}`);
              setOpen(next);
            }}
          >
            内容
          </Target>
        </div>
      );
    }
    views.push(render(<Host />));
    await settle();

    if (!openAtMount) {
      fireEvent.click(document.querySelector("button")!);
      await settle();
    }

    expect(document.querySelector(root), "面板确实打开了").not.toBeNull();
    expect(log, "打开既不回写开合状态，也不通知").toEqual([]);
  });
});

afterEach(() => {
  views.forEach((view) => view.unmount());
  views.length = 0;
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
});
