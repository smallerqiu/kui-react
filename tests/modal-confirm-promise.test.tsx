import { act, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { modal } from "../components";

/**
 * 命令式 confirm 的 onOk 契约：返回 Promise 时关闭时机交给组件接管 ——
 * resolve 才关窗，reject 只停 loading、窗口留着让用户改完再试；返回普通值则立刻关窗。
 * 以前 react 是"失败也关窗"，vue 是"失败一直转圈"，两边都不对，现在归一到这一份断言。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal-confirm-promise.test.ts。
 */

const okButton = () =>
  document.querySelector<HTMLButtonElement>(".k-toast-footer .k-btn-primary");

const isLoading = () => Boolean(okButton()?.classList.contains("k-btn-loading"));

// 窗口开着的时候遮罩层一定锁着页面滚动，关窗后锁会解掉；
// 光看 .k-toast-footer 还在不在不行——退场动画那 300ms 里节点还没摘。
const isOpen = () => document.body.classList.contains("k-scroll-locked");

const confirm = (props: Parameters<typeof modal.confirm>[0]) => {
  modal.confirm({ title: "标题", content: "内容", ...props });
  return waitFor(() => expect(okButton()).not.toBeNull());
};

// 每次点击发一个由测试说了算的 Promise：已经 resolve 的 Promise 会在同一批微任务里关掉窗口，
// loading 根本来不及被观察到，所以这里用"门"把 resolve/reject 的时机交给断言。
const gate = () => {
  let resolve!: (value: unknown) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<unknown>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

afterEach(async () => {
  modal.destroyAll();
  await new Promise((resolve) => setTimeout(resolve, 20));
  document.body.innerHTML = "";
});

describe("modal.confirm onOk promise", () => {
  it("closes the dialog once onOk resolves", async () => {
    const first = gate();
    const onOk = vi.fn(() => first.promise);
    await confirm({ onOk });

    fireEvent.click(okButton()!);
    expect(onOk).toHaveBeenCalledTimes(1);
    expect(isLoading()).toBe(true);

    act(() => first.resolve(undefined));
    await waitFor(() => expect(isOpen()).toBe(false));
  });

  it("keeps the dialog open and stops loading once onOk rejects", async () => {
    const gates = [gate(), gate()];
    let clicks = 0;
    const onOk = vi.fn(() => gates[clicks++].promise);
    await confirm({ onOk });

    fireEvent.click(okButton()!);
    expect(isLoading()).toBe(true);
    act(() => gates[0].reject(new Error("boom")));
    await waitFor(() => expect(isLoading()).toBe(false));
    expect(isOpen()).toBe(true);

    // 失败后窗口还在，用户可以直接重试
    fireEvent.click(okButton()!);
    expect(isLoading()).toBe(true);
    act(() => gates[1].resolve(undefined));
    await waitFor(() => expect(isOpen()).toBe(false));
    expect(onOk).toHaveBeenCalledTimes(2);
  });

  it("closes right away when onOk returns nothing", async () => {
    const onOk = vi.fn();
    await confirm({ onOk });

    fireEvent.click(okButton()!);
    expect(onOk).toHaveBeenCalledTimes(1);
    expect(isLoading()).toBe(false);
    await waitFor(() => expect(isOpen()).toBe(false));
  });
});
